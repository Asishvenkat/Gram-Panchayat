require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const User = require("./Database/user.js");
const connectDB = require("./Database/connection.js");

const app = express();
connectDB();
// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the template engine

// Connect to MongoDB


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Route: Home Page
app.get("/", (req, res) => {
  res.render("index"); // Renders home page (create "views/index.ejs")
});

// Route: Register Page
app.get("/register", (req, res) => {
  res.render("register"); // Renders register page (create "views/register.ejs")
});

// Route: Handle Registration
app.post("/register", async (req, res) => {
  console.log("Received Data:", req.body); // Check what data is actually received

  const { firstname, lastname, house_number, address, phone, email, password } = req.body;

  // Debug missing fields
  console.log("firstname:", firstname);
  console.log("lastname:", lastname);
  console.log("house_number:", house_number);
  console.log("address:", address);
  console.log("phone:", phone);
  console.log("email:", email);
  console.log("password:", password);

 // Check if any field is undefined
  if (!firstname || !lastname || !house_number || !address || !phone || !email || !password) {
    console.log("❌ Missing Fields Detected!");
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered. Try another one." });
    }

    const newUser = new User({ firstname, lastname, house_number, address, phone, email, password });
    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Route: Login Page
app.get("/login", (req, res) => {
  res.render("login"); // Renders login page (create "views/login.ejs")
});

// Route: Handle Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.send("❌ Invalid username or password.");
  }

  // Check if password matches
  if (user.password !== password) {
    return res.send("❌ Invalid username or password.");
  }

  res.send("✅ Login successful! Welcome, " + user.firstname);
});

// Route: Logout (Simply redirect to home page)
app.get("/logout", (req, res) => {
  res.redirect("/");
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
