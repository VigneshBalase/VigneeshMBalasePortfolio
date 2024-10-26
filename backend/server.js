const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: 'https://vigneesh-m-balase-portfolio.vercel.app', // Allow only your frontend origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
  allowedHeaders: [
    'Content-Type',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Date',
    'X-Api-Version'
  ],
  credentials: true // Allow cookies and authentication
}));

// Nodemailer transporter setup using SMTP for Gmail
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER, // Gmail email
        pass: process.env.EMAIL_PASS  // Gmail app password
    }
});

// POST endpoint to send email
app.post('/send-email', async (req, res) => {
    const { userName, userEmail, userPhoneNumber, message } = req.body;

    // Email options for Admin
    let adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'vigneshbalase07@gmail.com', // Admin email
        subject: `New message from ${userName}`,
        text: `Hi Vignesh M Balase,\n\n${userName} has sent you a message:\n\n"${message}"\n\nContact details:\n- Email: ${userEmail}\n- Phone: ${userPhoneNumber}\n\nBest regards,\nYour Contact Form`
    };

    // Email options for User confirmation
    let userMailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Message sent successfully to Vignesh M Balase`,
        text: `Hi ${userName},\n\nThank you for your message. Here are the details you provided:\n- Email: ${userEmail}\n- Message: "${message}"\n\nVignesh will get back to you shortly.\n\nBest regards,\nVignesh M Balase`
    };

    try {
        // Send email to Admin
        await transporter.sendMail(adminMailOptions);
        // Send confirmation email to User
        await transporter.sendMail(userMailOptions);

        // Respond to the client with success
        res.status(200).send('Emails sent successfully');
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).send('Error sending emails');
    }
});

// Handle pre-flight CORS requests for all routes
app.options('*', cors());

// Basic GET endpoint
app.get('/', (req, res) => {
    res.send('Welcome to Portfolio');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
