
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// In-memory user and workshop lists
const users = [];
const workshops = [];

// Signup Route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send({ error: 'Email already in use' });
  }

  // Add new user to the list
  const newUser = { name, email, password };
  users.push(newUser);

  res.status(201).send({ message: 'User created successfully' });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    return res.status(400).send({ error: 'Invalid email or password' });
  }

  res.status(200).send({ message: 'Login successful' });
});

// Register Workshop Route
app.post('/register', (req, res) => {
  const { title, description, date, time, location, instructor, logo } = req.body;

  const newWorkshop = { title, description, date, time, location, instructor, logo };
  workshops.push(newWorkshop);

  res.status(201).send({ message: 'Workshop registered successfully' });
});

// Get Workshops Route
app.get('/workshops', (req, res) => {
  res.send(workshops);
});

// Edit Workshop Route
app.put('/workshops/:title', (req, res) => {
  const { title } = req.params;
  const { description, date, time, location, instructor, logo } = req.body;

  const workshop = workshops.find(w => w.title === title);
  if (!workshop) {
    return res.status(404).send({ error: 'Workshop not found' });
  }

  workshop.description = description || workshop.description;
  workshop.date = date || workshop.date;
  workshop.time = time || workshop.time;
  workshop.location = location || workshop.location;
  workshop.instructor = instructor || workshop.instructor;
  workshop.logo = logo || workshop.logo;

  res.status(200).send({ message: 'Workshop updated successfully' });
});

// Delete Workshop Route
app.delete('/workshops/:title', (req, res) => {
  const { title } = req.params;
  const index = workshops.findIndex(workshop => workshop.title === title);
  if (index !== -1) {
    workshops.splice(index, 1);
    res.status(200).send({ message: 'Workshop deleted successfully' });
  } else {
    res.status(404).send({ error: 'Workshop not found' });
  }
});

// Endpoint to get all users (for debugging purposes)
app.get('/users', (req, res) => {
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
