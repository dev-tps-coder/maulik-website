const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();

// ⚠️ IMPORTANT: Keep your real Resend API Key here!
const resend = new Resend('re_M6S7S1Hm_3FFKwN81rhnu6SK8uzYT9idk'); 

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, type, budget, message } = req.body;

  if (!name || !email || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Send Email notification using Resend
    // Notice: NO fs.writeFileSync here! Just the email.
    await resend.emails.send({
      from: 'Portfolio Form <onboarding@resend.dev>', 
      to: 'developer.tripearlsoft@gmail.com', // ⚠️ Ensure this is your Resend login email
      subject: `New Project Brief from ${name}`,
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
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px; color: #333;">${message}</p>
      `
    });

    return res.status(200).json({ success: true, message: 'Inquiry captured successfully!' });

  } catch (error) {
    console.error('Server Error:', error); 
    return res.status(500).json({ error: 'Something went wrong on our end.' });
  }
});

module.exports = app;
