require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require('fs').promises;
const { engine } = require('express-handlebars');
const handlebarsHelpers = require('handlebars-helpers')();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // handle normal forms -> url encoded
app.use(express.json()); // Handle raw json data
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup Handlebars engine
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: handlebarsHelpers // Register all helpers from handlebars-helpers
  }))
  
  // Set Handlebars as the view engine
  app.set('view engine', '.hbs');
  app.set('views', path.join(__dirname, 'views')); // Path to views directory
  
  

// Routes setup
const uploadRoutes = require('./middleware/index');
app.use('/', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});