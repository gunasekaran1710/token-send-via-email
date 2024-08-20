const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'secret@123'; // Replace with a secure key
const EMAIL_USER = 'dummmyemail2@gmail.com'; // Replace with your email
const EMAIL_PASS = 'gbaftcsskxcazmth'; // Replace with your email password

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other service you use
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Sign-in endpoint to generate token and send it via email
app.post('/signin', (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  console.log(token);

  // Send token via email
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your Sign-In Token',
    text: `Here is your sign-in token: ${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Token sent to your email' });
  });
});

// Login endpoint to verify token
app.post('/login', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(200).json({ message: 'Login successful', user: decoded });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
