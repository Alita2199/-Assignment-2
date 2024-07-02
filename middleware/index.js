const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer'); // Adjust path if necessary
const fs = require('fs');
const path = require('path');

// Home Page
router.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});


// Upload a Single File
router.get('/upload', (req, res) => {
  res.render('upload', { title: 'Upload File' });
});

router.post('/upload', multer.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});

// Upload Multiple Files
router.get('/upload-multiple', (req, res) => {
  res.render('upload-multiple', { title: 'Upload Multiple Files' });
});

router.post('/upload-multiple', multer.array('files', 15), (req, res) => {
  res.send('Files uploaded successfully!');
});


router.get('/fetch-single', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to scan directory');
      }
      const randomFile = files[Math.floor(Math.random() * files.length)];
      res.render('fetch-single', { image: { filePath: randomFile } });
    });
  });
// Fetch Multiple Random Images (based on query parameter count)
router.get('/fetch-multiple', (req, res) => {
    const count = req.query.count || 3; // Default to 3 files
    const directoryPath = path.join(__dirname, '../uploads');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to scan directory');
      }
      const randomFiles = [];
      for (let i = 0; i < count; i++) {
        randomFiles.push(files[Math.floor(Math.random() * files.length)]);
      }
      res.render('fetch-multiple', { files: randomFiles });
    });
  });

// View Gallery of All Files
router.get('/gallery', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('Unable to scan directory');
      }
      res.render('gallery', { files });
    });
  });

// Gallery with Pagination
router.get('/gallery-pagination', (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads');
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }

    const totalItems = files.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedFiles = files.slice(start, end);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    res.render('gallery-pagination', {
      files: paginatedFiles,
      currentPage: page,
      pageNumbers
    });
  });
});

module.exports = router;