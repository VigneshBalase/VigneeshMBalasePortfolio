require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
   app.use(cors({
    origin: 'https://vigneesh-m-balase-portfolio.vercel.app', 
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Endpoint to send email
app.post('/send-email', async (req, res) => {
    const { userName, userEmail, userPhoneNumber, message } = req.body;
  
    // Set up Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your admin email
        pass: process.env.EMAIL_PASS,  // Your email password
      },
    });
    // Email to Admin (Vignesh M Balase)
    let adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vigneshbalase07@gmail.com',
      subject: `New message from ${userName}`,
      text: `Hi Vignesh M Balase,\n\n${userName} wants to connect with you regarding the following message:\n\n"${message}"\n\nYou can reach them through their email: ${userEmail} or phone number: ${userPhoneNumber}.\n\nBest regards,\nYour Contact Form`,
    };
  
    // Confirmation email to User
    let userMailOptions = {
      from: process.env.EMAIL_USER, // Your admin email
      to: userEmail,
      subject: `Message successfully sent to Vignesh M Balase`,
      text: `Hi ${userName},\n\nThank you for reaching out! Your message has been successfully sent to Vignesh M Balase.\n\nHere are the details of your message:\n- Email: ${userEmail}\n- Message: "${message}"\n\nVignesh will get back to you shortly.\n\nBest regards,\nVignesh M Balase`,
    };
  
    try {
      // Send email to Admin
      await transporter.sendMail(adminMailOptions);
      // Send confirmation email to User
      await transporter.sendMail(userMailOptions);
  
      res.status(200).send('Emails sent successfully');
    } catch (error) {
      console.error('Error sending emails:', error);
      res.status(500).send('Error sending emails');
    }
  });
  
app.get('/', async (req, res) => {
    try {
        // Render your portfolio page or send a response
        res.sendFile(path.join(__dirname, '../frontend/index.html')); // Adjust the path as necessary
    } catch (error) {
        console.error('Error loading portfolio:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
