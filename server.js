const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json({ limit: '10mb' })); // setting size limit for base64 images upload
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper function to read a JSON database file
function readData(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading database ${filename}:`, error);
    return [];
  }
}

// Helper function to write to a JSON database file
function writeData(filename, data) {
  const filePath = path.join(__dirname, 'data', filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing database ${filename}:`, error);
    return false;
  }
}

// ==================== API ENDPOINTS ====================

// GET: Properties List
app.get('/api/properties', (req, res) => {
  const properties = readData('properties.json');
  res.json(properties);
});

// POST: Add Property Listing
app.post('/api/properties', (req, res) => {
  const { title, price, location, address, type, bedrooms, bathrooms, sqft, description, image } = req.body;
  
  if (!title || !price || !location || !address || !type || !bedrooms || !bathrooms || !sqft || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const properties = readData('properties.json');
  
  // Calculate next ID
  const nextId = properties.reduce((maxId, p) => Math.max(maxId, p.id || 0), 0) + 1;

  const newProperty = {
    id: nextId,
    title,
    price: parseFloat(price),
    location: location.toLowerCase().trim(),
    address,
    type,
    bedrooms: isNaN(parseInt(bedrooms)) ? bedrooms : parseInt(bedrooms),
    bathrooms: parseInt(bathrooms),
    sqft: parseInt(sqft),
    description,
    image: image || 'images/property-1.jpg',
    link: `#` // dynamic links or custom pages can point back or resolve in frontend
  };

  properties.push(newProperty);
  const success = writeData('properties.json', properties);

  if (success) {
    res.status(201).json(newProperty);
  } else {
    res.status(500).json({ error: 'Failed to write property data' });
  }
});

// GET: Reviews List
app.get('/api/reviews', (req, res) => {
  const reviews = readData('reviews.json');
  res.json(reviews);
});

// POST: Submit Customer Review
app.post('/api/reviews', (req, res) => {
  const { name, rating, text, designation } = req.body;

  if (!name || !rating || !text) {
    return res.status(400).json({ error: 'Name, rating, and text are required' });
  }

  const reviews = readData('reviews.json');
  
  const newReview = {
    id: reviews.length + 1,
    name,
    rating: parseInt(rating),
    text,
    designation: designation || 'Verified Customer',
    date: new Date().toISOString().split('T')[0]
  };

  reviews.push(newReview);
  const success = writeData('reviews.json', reviews);

  if (success) {
    res.status(201).json(newReview);
  } else {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// POST: Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const messages = readData('messages.json');
  
  const newMessage = {
    id: messages.length + 1,
    name,
    email,
    phone: phone || '',
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);
  const success = writeData('messages.json', messages);

  if (success) {
    res.status(201).json({ success: true, message: 'Message received' });
  } else {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Serve static files from the project root directory
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for navigation root queries
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  MyHome Real Estate App Server is Running!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
