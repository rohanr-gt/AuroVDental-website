import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { initDb, dbRun, dbAll, dbGet } from '../database/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ----------------------------
// Email (SMTP) - for localhost + production
// ----------------------------
function getSmtpConfig() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_SERVICE
  } = process.env;

  const hasService = Boolean(SMTP_SERVICE && SMTP_USER && SMTP_PASS);
  const hasHost = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
  if (!hasService && !hasHost) return null;

  return {
    service: SMTP_SERVICE || undefined,
    host: SMTP_HOST || undefined,
    port: SMTP_PORT ? Number(SMTP_PORT) : undefined,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    from: SMTP_FROM || SMTP_USER
  };
}

let cachedMailer = null;
function getMailer() {
  const cfg = getSmtpConfig();
  if (!cfg) return null;
  if (cachedMailer) return cachedMailer;

  const transporter = nodemailer.createTransport({
    service: cfg.service,
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth
  });

  cachedMailer = { transporter, from: cfg.from };
  return cachedMailer;
}

let cachedTestMailerPromise = null;
async function getTestMailer() {
  if (cachedTestMailerPromise) return cachedTestMailerPromise;
  cachedTestMailerPromise = (async () => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    return { transporter, from: `SmileVista Dental <${testAccount.user}>`, testAccount };
  })();
  return cachedTestMailerPromise;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function sendAppointmentConfirmationEmail({ to, appointment, confirmationNumber }) {
  const mailer = getMailer();
  const toEmail = normalizeEmail(to);
  const usingTestMailer = !mailer;
  if (!toEmail) return { attempted: false, sent: false, reason: 'missing_email' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return { attempted: false, sent: false, reason: 'invalid_email' };
  }

  const subject = `SmileVista Appointment Confirmation (${confirmationNumber})`;
  const text = [
    `Hi ${appointment.name},`,
    '',
    'Your appointment has been booked. Here are the details:',
    '',
    `Confirmation: ${confirmationNumber}`,
    `Name: ${appointment.name}`,
    `Phone: ${appointment.phone}`,
    `Date: ${appointment.date}`,
    `Time: ${appointment.time}`,
    `Service: ${appointment.service || '-'}`,
    `Issue: ${appointment.issue || '-'}`,
    '',
    '— SmileVista Dental'
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Hi <strong>${appointment.name}</strong>,</p>
      <p>Your appointment has been booked. Here are the details:</p>
      <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr><td><strong>Confirmation</strong></td><td>${confirmationNumber}</td></tr>
        <tr><td><strong>Name</strong></td><td>${appointment.name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${appointment.phone}</td></tr>
        <tr><td><strong>Date</strong></td><td>${appointment.date}</td></tr>
        <tr><td><strong>Time</strong></td><td>${appointment.time}</td></tr>
        <tr><td><strong>Service</strong></td><td>${appointment.service || '-'}</td></tr>
        <tr><td><strong>Issue</strong></td><td>${appointment.issue || '-'}</td></tr>
      </table>
      <p>— SmileVista Dental</p>
    </div>
  `;

  try {
    const activeMailer = mailer || (await getTestMailer());
    const info = await activeMailer.transporter.sendMail({
      from: activeMailer.from,
      to: toEmail,
      subject,
      text,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    if (usingTestMailer) {
      return { attempted: true, sent: true, mode: 'ethereal', previewUrl, messageId: info?.messageId };
    }
    return { attempted: true, sent: true, mode: 'smtp', messageId: info?.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { attempted: true, sent: false, reason: 'send_failed' };
  }
}

async function sendReminderEmail({ to, appointment }) {
  const mailer = getMailer();
  const toEmail = normalizeEmail(to);
  if (!mailer || !toEmail) return { sent: false };

  const subject = `Reminder: Your Appointment Tomorrow with SmileVista`;
  const text = `Hi ${appointment.name}, this is a reminder for your appointment tomorrow, ${appointment.date} at ${appointment.time}. We look forward to seeing you!`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Hi <strong>${appointment.name}</strong>,</p>
      <p>This is a friendly reminder for your appointment tomorrow:</p>
      <p><strong>Date:</strong> ${appointment.date}<br>
      <strong>Time:</strong> ${appointment.time}</p>
      <p>We look forward to seeing you!</p>
      <p>— SmileVista Dental</p>
    </div>
  `;

  try {
    await mailer.transporter.sendMail({ from: mailer.from, to: toEmail, subject, text, html });
    return { sent: true };
  } catch (error) {
    console.error('Reminder email error:', error);
    return { sent: false };
  }
}

// ----------------------------
// Paths / static
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ----------------------------
// Database (MySQL)
// ----------------------------
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Gallery schema is handled in initial creation for MySQL

// In-memory storage (non-persistent)
let assessments = [];
let chatHistory = [];

// ----------------------------
// Admin auth (fixed creds)
// ----------------------------
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'smilevista-dev-secret';
const JWT_EXPIRES_IN = '7d';

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const [type, token] = auth.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload?.role !== 'admin') return res.status(403).json({ success: false, error: 'Forbidden' });
    req.admin = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({ success: true, token });
});

// ----------------------------
// Uploads (gallery)
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeBase = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}_${safeBase}`);
  }
});
const upload = multer({ storage });

// ============================================
// STEP 3: AI SMILE PREVIEW API
// ============================================
app.post('/api/smile-preview', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Image processed successfully',
      transformedImage: req.body.image,
      recommendations: [
        'Teeth Whitening - to brighten your smile',
        'Veneers - for a more elegant look',
        'Smile Designing - for perfect proportions'
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// STEP 4: TREATMENT RECOMMENDATION API
// ============================================
app.post('/api/recommend-treatment', (req, res) => {
  const { answers } = req.body;
  let recommendedTreatment = 'General Checkup';

  if (answers) {
    if (answers.missingTeeth && answers.missingTeeth > 0) {
      recommendedTreatment = 'Dental Implants';
    } else if (answers.teeth === 'crooked') {
      recommendedTreatment = 'Aligners & Braces';
    } else if (answers.teeth === 'discolored') {
      recommendedTreatment = 'Teeth Whitening + Smile Designing';
    } else if (answers.smile === 'not-happy') {
      recommendedTreatment = 'Digital Smile Designing';
    }
  }

  const assessment = {
    id: assessments.length + 1,
    recommendedTreatment,
    details: answers,
    createdAt: new Date()
  };

  assessments.push(assessment);

  res.json({
    success: true,
    recommendedTreatment,
    estimatedCost: Math.floor(Math.random() * 5000) + 1000,
    timeframe: '3-6 months',
    assessmentId: assessment.id
  });
});

// ============================================
// STEP 5: APPOINTMENTS API
// ============================================
const AVAILABLE_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM'
];

app.post('/api/appointments', async (req, res) => {
  const { name, phone, email, date, time, service, issue } = req.body;

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let appointmentId;
  try {
    const result = await dbRun(
      `INSERT INTO appointments (name, phone, email, date, time, service, issue, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email || null, date, time, service || null, issue || null, 'pending', createdAt]
    );
    appointmentId = result.lastID;
  } catch (error) {
    console.error('❌ Appointment insert error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save appointment' });
  }

  const appointment = {
    id: appointmentId,
    name,
    phone,
    email,
    date,
    time,
    service,
    issue,
    status: 'pending',
    createdAt: new Date()
  };

  const confirmationNumber = `APT-${Date.now()}`;

  // Store as a lead (persistent)
  let leadStatus = { saved: false, error: null };
  try {
    const result = await dbRun(
      `INSERT INTO leads (name, phone, email, source, service, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email || null,
        'booking',
        service || null,
        issue || null,
        'new',
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
    leadStatus = { saved: true, leadId: result.lastID };
    console.log(`✅ Lead saved: id=${result.lastID} name=${name}`);
  } catch (error) {
    console.error('❌ Lead insert error:', error);
    leadStatus = { saved: false, error: error.message, code: error.code };
  }

  const emailStatus = await sendAppointmentConfirmationEmail({
    to: email,
    appointment,
    confirmationNumber
  });

  return res.json({
    success: true,
    message: 'Appointment booked successfully!',
    appointment,
    confirmationNumber,
    emailStatus,
    leadStatus
  });
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await dbAll(`SELECT * FROM appointments ORDER BY createdAt DESC`);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

app.get('/api/available-slots', (req, res) => {
  res.json({ success: true, slots: AVAILABLE_SLOTS });
});

// ============================================
// STEP 6: GALLERY API
// ============================================
app.get('/api/gallery', (req, res) => {
  dbAll(`SELECT id, category, title, imageUrl, createdAt FROM gallery ORDER BY id DESC`)
    .then((rows) => {
      const gallery = rows.map((r) => ({
        id: r.id,
        category: r.category,
        title: r.title,
        image: r.imageUrl,
        createdAt: r.createdAt
      }));
      res.json({ success: true, gallery });
    })
    .catch((error) => {
      console.error('Gallery fetch error:', error);
      res.json({ success: true, gallery: [] });
    });
});

// ============================================
// ADMIN: LEADS API
// ============================================
app.get('/api/leads', requireAdmin, (req, res) => {
  dbAll(`SELECT * FROM leads ORDER BY createdAt DESC`)
    .then((rows) => res.json({ success: true, leads: rows }))
    .catch((error) => {
      console.error('Leads fetch error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    });
});

app.patch('/api/leads/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ success: false, error: 'Missing status' });
  dbRun(`UPDATE leads SET status = ? WHERE id = ?`, [status, id])
    .then(() => res.json({ success: true }))
    .catch((error) => {
      console.error('Lead update error:', error);
      res.status(500).json({ success: false, error: 'Failed to update lead' });
    });
});

// ============================================
// ADMIN: GALLERY UPLOAD API
// ============================================
app.post(
  '/api/admin/gallery',
  requireAdmin,
  upload.single('image'),
  (req, res) => {
    const { category, title } = req.body || {};
    const imageFile = req.file;

    if (!category || !title || !imageFile) {
      if (imageFile?.path) fs.unlink(imageFile.path, () => { });
      return res.status(400).json({ success: false, error: 'Missing required fields/files' });
    }

    const imageUrl = `/uploads/${imageFile.filename}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    dbRun(
      `INSERT INTO gallery (category, title, imageUrl, createdAt) VALUES (?, ?, ?, ?)`,
      [category, title, imageUrl, createdAt]
    )
      .then(({ lastID }) => {
        res.json({
          success: true,
          item: { id: lastID, category, title, image: imageUrl, createdAt }
        });
      })
      .catch((error) => {
        console.error('Gallery insert error:', error);
        fs.unlink(imageFile.path, () => { });
        res.status(500).json({ success: false, error: 'Failed to save gallery item' });
      });
  }
);

app.delete('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await dbGet(`SELECT imageUrl FROM gallery WHERE id = ?`, [id]);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });

    await dbRun(`DELETE FROM gallery WHERE id = ?`, [id]);

    const imgPath = path.join(uploadsDir, path.basename(item.imageUrl || ''));
    if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => { });

    return res.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
});

// ============================================
// STEP 8: CHATBOT API
// ============================================
const CLINIC = {
  brand: 'SmileVista Dental',
  whatsappNumber: '919731065325',
  email: 'hello@smilevista.com',
  bookingPath: '/booking',
  faqPath: '/faq',
  assessmentPath: '/assessment',
  aiPreviewPath: '/ai-preview',
  services: [
    { key: 'smile-designing', label: 'Digital Smile Designing', path: '/smile-designing' },
    { key: 'aligners-braces', label: 'Aligners & Braces', path: '/aligners-braces' },
    { key: 'dental-implants', label: 'Dental Implants', path: '/dental-implants' }
  ]
};

const CHATBOT_VERSION = '2026-04-22-slots-v1';

const FAQS = [
  {
    id: 1,
    category: 'general',
    question: 'How long do treatments take?',
    answer:
      "Treatment duration varies by procedure. Smile designing: 1–2 weeks. Aligners: 6–18 months. Implants: 3–6 months. For an accurate plan, book a consultation."
  },
  {
    id: 2,
    category: 'implants',
    question: 'Are dental implants safe?',
    answer:
      "Yes—implants are widely used and have a high success rate for suitable candidates. A quick consult helps confirm eligibility based on bone health and medical history."
  },
  {
    id: 3,
    category: 'aligners',
    question: 'Can I eat with aligners?',
    answer:
      'Remove aligners before eating or drinking anything except water. Wear them ~22 hours/day for best results.'
  },
  {
    id: 4,
    category: 'general',
    question: 'What is the cost of treatments?',
    answer:
      'Costs depend on complexity and the chosen plan. Share photos/X‑rays or book a consultation for a personalized estimate.'
  },
  {
    id: 5,
    category: 'smile-designing',
    question: 'Is smile designing permanent?',
    answer:
      'Longevity depends on the approach. Veneers often last 10–15 years; bonding may last 5–7 years. Good hygiene and regular checkups extend results.'
  },
  {
    id: 6,
    category: 'general',
    question: 'Do you accept insurance?',
    answer:
      'We can help you understand coverage options. Share your insurer/plan during consultation and we’ll guide the next steps.'
  }
];

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

function bestFaqMatch(text) {
  // very small, fast matcher; good enough for this project
  const tokens = new Set(text.split(' ').filter(Boolean));
  let best = null;
  let bestScore = 0;
  for (const faq of FAQS) {
    const q = norm(faq.question);
    const a = norm(faq.answer);
    let score = 0;
    for (const t of tokens) {
      if (t.length <= 2) continue;
      if (q.includes(t)) score += 3;
      else if (a.includes(t)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return bestScore >= 5 ? best : null;
}

function buildQuickReplies(intent) {
  switch (intent) {
    case 'services':
      return ['Smile designing details', 'Aligners & braces details', 'Dental implants details', 'Pricing', 'Book appointment'];
    case 'booking':
      return ['Available time slots', 'What should I bring?', 'Pricing', 'Emergency support'];
    case 'pricing':
      return ['Smile designing cost', 'Aligners cost', 'Implants cost', 'Book appointment'];
    case 'emergency':
      return ['Call/WhatsApp now', 'Book urgent appointment', 'Pain & swelling advice'];
    case 'assessment':
      return ['How does assessment work?', 'Is it accurate?', 'Book appointment'];
    default:
      return ['Treatments', 'Book appointment', 'Pricing', 'FAQ', 'Contact'];
  }
}

function answerFor(text) {
  const t = norm(text);
  if (!t) {
    return {
      reply: "Please type a question like “treatments”, “booking”, “pricing”, or “implants”.",
      intent: 'default'
    };
  }

  if (includesAny(t, ['hi', 'hello', 'hey', 'good morning', 'good evening'])) {
    return {
      reply: `Hello. I’m the ${CLINIC.brand} assistant. I can help with treatments, pricing guidance, and booking. What would you like to do?`,
      intent: 'greeting'
    };
  }

  // Direct intents
  if (includesAny(t, ['time slot', 'time slots', 'available slots', 'available times', 'slots', 'timing', 'timings'])) {
    const slotList = AVAILABLE_SLOTS.map((s) => `- ${s}`).join('\n');
    return {
      reply:
        `Available time slots (today’s standard schedule):\n${slotList}\n\nTo pick one, open ${CLINIC.bookingPath} and select a date + slot.`,
      intent: 'booking'
    };
  }

  if (includesAny(t, ['book', 'booking', 'appointment', 'schedule'])) {
    return {
      reply:
        `To book, open ${CLINIC.bookingPath} and choose a service, date, and time slot.\n\nIf you prefer WhatsApp: wa.me/${CLINIC.whatsappNumber}`,
      intent: 'booking'
    };
  }

  if (includesAny(t, ['treat', 'treatment', 'service', 'services', 'offer', 'do you do'])) {
    const serviceList = CLINIC.services.map((s) => `- ${s.label}: ${s.path}`).join('\n');
    return {
      reply: `We offer:\n${serviceList}\n\nWant details on one (smile designing / aligners / implants)?`,
      intent: 'services'
    };
  }

  if (includesAny(t, ['smile designing', 'smile design', 'veneers', 'whitening', 'designing'])) {
    return {
      reply:
        `Digital Smile Designing focuses on aesthetics + bite harmony. Typical timeline is about 1–2 weeks depending on your case.\nLearn more: /smile-designing\n\nIf you want, share what you want to improve (shape, color, gaps, alignment).`,
      intent: 'service_smile_designing'
    };
  }

  if (includesAny(t, ['aligner', 'aligners', 'braces', 'invisalign', 'crooked'])) {
    return {
      reply:
        `Aligners & Braces straighten teeth gradually. Many aligner plans run ~6–18 months depending on complexity.\nLearn more: /aligners-braces\n\nDo you prefer clear aligners or braces?`,
      intent: 'service_aligners'
    };
  }

  if (includesAny(t, ['implant', 'implants', 'missing tooth', 'missing teeth'])) {
    return {
      reply:
        `Dental implants replace missing teeth with a long-term solution. Treatment often takes ~3–6 months (varies by healing/bone).\nLearn more: /dental-implants\n\nHow many teeth are you looking to replace?`,
      intent: 'service_implants'
    };
  }

  if (includesAny(t, ['price', 'pricing', 'cost', 'fees', 'how much'])) {
    return {
      reply:
        `Implant pricing depends on your clinical condition and treatment plan. Typical starting ranges are:\n\n• Single Implant: ₹25,000 – ₹50,000\n• Multiple Implants: Based on case\n• Full Mouth Implants: ₹2L – ₹5L\n• All-on-4 / All-on-6: Starting from ₹2.5L\n\nFinal cost depends on your clinical condition and treatment plan.`,
      intent: 'pricing'
    };
  }

  if (includesAny(t, ['emergency', 'urgent', 'pain', 'swelling', 'bleeding'])) {
    return {
      reply:
        `If this is severe pain, swelling, bleeding, fever, or trouble breathing/swallowing, seek urgent medical care.\n\nFor dental emergencies, message us on WhatsApp: wa.me/${CLINIC.whatsappNumber} (include your symptoms + photo if possible).`,
      intent: 'emergency'
    };
  }

  if (includesAny(t, ['assessment', 'quiz', 'recommend', 'recommendation', 'treatment recommendation'])) {
    return {
      reply:
        `You can take our quick assessment here: ${CLINIC.assessmentPath}. It suggests a likely treatment based on your answers.\n\nFor clinical accuracy, we confirm with an in-person exam.`,
      intent: 'assessment'
    };
  }

  if (includesAny(t, ['ai preview', 'preview', 'smile preview', 'photo', 'image'])) {
    return {
      reply:
        `Try the AI smile preview here: ${CLINIC.aiPreviewPath}. It’s a visual simulation (real outcomes can vary).`,
      intent: 'ai_preview'
    };
  }

  if (includesAny(t, ['faq', 'questions', 'common questions'])) {
    return { reply: `You can browse FAQs here: ${CLINIC.faqPath}`, intent: 'faq' };
  }

  if (includesAny(t, ['contact', 'email', 'mail', 'whatsapp', 'phone'])) {
    return {
      reply: `Contact us:\n- Email: ${CLINIC.email}\n- WhatsApp: wa.me/${CLINIC.whatsappNumber}`,
      intent: 'contact'
    };
  }

  // FAQ-style fallback
  const faq = bestFaqMatch(t);
  if (faq) {
    return { reply: `${faq.answer}\n\nMore: ${CLINIC.faqPath}`, intent: 'faq_match' };
  }

  return {
    reply:
      `I can help with treatments, booking, pricing guidance, emergency steps, and FAQs.\nTry: “book appointment”, “aligners”, “implants”, “pricing”, or “contact”.`,
    intent: 'default'
  };
}

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  const { reply, intent } = answerFor(message);
  const quickReplies = buildQuickReplies(intent);

  const chat = { message, reply, intent, timestamp: new Date() };
  chatHistory.push(chat);

  res.json({ success: true, reply, quickReplies, intent, chatbotVersion: CHATBOT_VERSION });
});

// ============================================
// STEP 9: TRANSLATIONS API
// ============================================
app.get('/api/translations/:language', (req, res) => {
  const translations = {
    en: { services: 'Services', booking: 'Book Appointment', smile: 'Your Perfect Smile Awaits' },
    es: { services: 'Servicios', booking: 'Reservar Cita', smile: 'Tu Sonrisa Perfecta Te Espera' }
  };
  const lang = req.params.language || 'en';
  res.json({ success: true, translations: translations[lang] || translations.en });
});

// ============================================
// STEP 10: FAQ API
// ============================================
app.get('/api/faqs', (req, res) => {
  const faqs = [
    { id: 1, category: 'general', question: 'How long do treatments take?', answer: 'Treatment duration varies by procedure. Schedule a consultation for details.' },
    { id: 2, category: 'implants', question: 'Are dental implants safe?', answer: 'Yes, implants are FDA-approved and have a 95%+ success rate.' },
    { id: 3, category: 'aligners', question: 'Can I eat with aligners?', answer: 'Remove aligners before eating. Wear them 22 hours daily for best results.' },
    { id: 4, category: 'implants', question: 'How long do dental implants last?', answer: 'With proper care, implants can last many years or even a lifetime.' },
    { id: 5, category: 'general', question: 'Is the procedure painful?', answer: 'The procedure is done under anesthesia and is generally comfortable.' },
    { id: 6, category: 'general', question: 'How long does treatment take?', answer: 'Most implant treatments are completed within 3–7 days depending on the case.' },
    { id: 7, category: 'general', question: 'Can I travel for treatment?', answer: 'Yes, we provide structured plans for outstation and international patients.' }
  ];
  res.json({ success: true, faqs });
});

// ============================================
// STEP 11: REMINDER SYSTEM (Cron Job)
// ============================================
// Send reminder emails at 9 AM daily
cron.schedule('0 9 * * *', async () => {
  console.log('📧 Running appointment reminder job...');
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  try {
    const reminders = await dbAll(`SELECT * FROM appointments WHERE date = ? AND email IS NOT NULL AND email != ''`, [tomorrow]);
    console.log(`💬 Sending ${reminders.length} reminders for tomorrow (${tomorrow})...`);

    for (const apt of reminders) {
      await sendReminderEmail({ to: apt.email, appointment: apt });
    }
  } catch (err) {
    console.error('❌ Reminder job error:', err);
  }
});

// ============================================
// SERVE FRONTEND (React)
// ============================================
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'SmileVista Dental API is running', version: '1.0.0' });
});

// DB diagnostic endpoint - safe to remove after deployment is verified
app.get('/api/db-status', async (req, res) => {
  const env = {
    MYSQL_HOST: process.env.MYSQL_HOST || '(not set)',
    MYSQL_PORT: process.env.MYSQL_PORT || '(default 3306)',
    MYSQL_USER: process.env.MYSQL_USER || '(not set)',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || '(not set)',
    MYSQL_PASSWORD_SET: process.env.MYSQL_PASSWORD ? 'yes' : 'no'
  };

  try {
    const rows = await dbAll('SELECT COUNT(*) AS leadCount FROM leads');
    const recent = await dbAll(
      'SELECT id, name, phone, email, service, createdAt FROM leads ORDER BY id DESC LIMIT 5'
    );
    return res.json({
      success: true,
      connected: true,
      env,
      leadCount: rows[0]?.leadCount ?? 0,
      recentLeads: recent
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      connected: false,
      env,
      error: err.message,
      code: err.code,
      errno: err.errno
    });
  }
});

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ All APIs ready for SmileVista Dental');
});