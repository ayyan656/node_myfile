const express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // For password hashing

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary in-memory storage for users
const users = [];

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// User registration (Signup)
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword // Store hashed password
    };

    // Add user to the array
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
});

// Start server
const PORT = 3008;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
