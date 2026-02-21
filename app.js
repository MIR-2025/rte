import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createTransport } from 'nodemailer';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', true);
morgan.token('date', () => new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }));
app.use(morgan('combined'));
const PORT = 26216;

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook needs raw body — must be before json/urlencoded parsers
app.post('/donate/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Donation received: $${(session.amount_total / 100).toFixed(2)} from ${session.customer_details?.email || 'anonymous'}`);
  }

  res.json({ received: true });
});

// Parse form bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// SMTP transporter
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// View engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Header include partial
app.use((req, res, next) => {
  res.locals.siteName = 'RTE';
  res.locals.siteTagline = 'Rich Text Editor';
  res.locals.stripeEnabled = !!process.env.STRIPE_PUBLISHABLE_KEY;
  next();
});

// Block browser navigation to /api/ai (GET returns 404)
app.get('/api/ai', (req, res) => res.status(404).render('404', { page: '404' }));

// AI proxy endpoint (keeps API key server-side)
app.post('/api/ai', async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key configured' });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    res.status(resp.status);
    if (req.body.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      resp.body.pipe(res);
    } else {
      res.setHeader('Content-Type', 'application/json');
      const data = await resp.text();
      res.send(data);
    }
  } catch (err) {
    res.status(500).json({ error: 'AI proxy error' });
  }
});

// Static files — serves rte.js from project root
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.render('index', { page: 'home' });
});

app.get('/docs', (req, res) => {
  res.render('docs', { page: 'docs' });
});

app.get('/api', (req, res) => {
  res.render('api', { page: 'api' });
});

app.get('/examples', (req, res) => {
  res.render('examples', { page: 'examples' });
});

app.get('/pro', (req, res) => {
  res.render('pro', { page: 'pro' });
});

app.get('/websocket', (req, res) => {
  res.render('websocket', { page: 'websocket' });
});

app.get('/wskit', (req, res) => {
  res.render('wskit', { page: 'wskit' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { page: 'contact', sent: false, error: null });
});

app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.render('contact', {
      page: 'contact', sent: false,
      error: 'Please fill in all required fields.',
    });
  }

  try {
    await transporter.sendMail({
      from: `"RTE Contact Form" <${process.env.SMTP_FROM}>`,
      replyTo: `"${name}" <${email}>`,
      to: process.env.SMTP_FROM,
      subject: subject || `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h3>New message from RTE Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || '(none)'}</p>
        <hr>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    console.log(`Contact email sent from ${name} <${email}> — subject: ${subject || '(none)'}`);
    res.render('contact', { page: 'contact', sent: true, error: null });
  } catch (err) {
    console.error('Mail error:', err);
    res.render('contact', {
      page: 'contact', sent: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
});

// Donate page
app.get('/donate', (req, res) => {
  res.render('donate', { page: 'donate', stripeKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.get('/donate/success', (req, res) => {
  res.render('donate-success', { page: 'donate' });
});

app.get('/donate/cancelled', (req, res) => {
  res.render('donate', { page: 'donate', stripeKey: process.env.STRIPE_PUBLISHABLE_KEY, cancelled: true });
});

// Create Stripe Checkout session
app.post('/donate/create-session', async (req, res) => {
  const { amount } = req.body;
  const cents = Math.round(parseFloat(amount) * 100);

  if (!cents || cents < 100) {
    return res.status(400).json({ error: 'Minimum donation is $1.00' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'RTE Donation',
            description: 'Support the RTE Rich Text Editor project',
          },
          unit_amount: cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://rte.whitneys.co/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://rte.whitneys.co/donate/cancelled`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// 404 catch-all (must be last route)
app.use((req, res) => {
  res.status(404).render('404', { page: '404' });
});

app.listen(PORT, () => {
  console.log(`RTE docs running at http://localhost:${PORT}`);
});
