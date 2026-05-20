const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with your API key (Get a free key from resend.com)
const resend = new Resend('re_HzeZiPAq_4gKnKtTh255ryVFRYZaM5ngg');

// Middleware
app.use(cors()); // Allows your front-end to talk to this API
app.use(express.json()); // Parses incoming JSON data

// Path to store your incoming inquiries locally
const DATA_FILE = path.join(__dirname, 'inquiries.json');

// POST Endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, type, budget, message } = req.body;

  // 1. Basic Validation
  if (!name || !email || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const newInquiry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    name,
    company: company || 'N/A',
    email,
    phone: phone || 'N/A',
    type,
    budget: budget || 'Not specified',
    message
  };

  try {
    // 2. Save locally into inquiries.json
    let existingData = [];
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      existingData = JSON.parse(fileContent || '[]');
    }
    existingData.push(newInquiry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));

    // 3. Send Email notification using Resend
    await resend.emails.send({
      from: 'Portfolio Form <onboarding@resend.dev>', // Change to your verified domain later if you want
      to: 'vishal.tripearlsoft@gmail.com',
      subject: `New Project Brief from ${name} (${company || 'No Company'})`,
      html: `
        <h2>New Inquiry Captured</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Looking for:</strong> ${type}</p>
        <p><strong>Budget Range:</strong> ${budget || 'Not specified'}</p>
        <br>
        <p><strong>Project Details:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
      `
    });

    return res.status(200).json({ success: true, message: 'Inquiry captured successfully!' });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Something went wrong on our end.' });
  }
});

// Remove app.listen and add this export for Vercel
module.exports = app;