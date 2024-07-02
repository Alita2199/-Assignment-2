const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage: storage });


const uploadSingle = multer({ storage }).single('file');
const uploadMultiple = multer({ storage, limits: { files: 15 } }).array('files', 15);

exports.home = (req, res) => {
  res.render('home', { title: 'Home Page' });
};

exports.uploadPage = (req, res) => {
  res.render('upload', { title: 'Upload File' });
};

exports.uploadSingle = (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).send("Error uploading file.");
    }
    res.redirect('/');
  });
};

exports.uploadMultiple = (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return res.status(400).send("Error uploading files.");
    }
    res.redirect('/');
  });
};

exports.randomImage = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    const randomFile = files[Math.floor(Math.random() * files.length)];
    res.render('single', { title: 'Random Image', file: randomFile });
  });
};

exports.randomImages = (req, res) => {
  const count = parseInt(req.body.count) || 1;
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    const randomFiles = files.sort(() => 0.5 - Math.random()).slice(0, count);
    res.render('multiple-images', { title: 'Multiple Random Images', files: randomFiles });
  });
};

exports.gallery = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    res.render('gallery', { title: 'Gallery', files });
  });
};

exports.galleryPagination = (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const limit = 5;
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    const paginatedFiles = files.slice((page - 1) * limit, page * limit);
    res.render('gallery-pagination', { title: 'Gallery with Pagination', files: paginatedFiles, page, pages: Math.ceil(files.length / limit) });
  });
};
