const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Store files in the 'images' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()); 
  }
});

const upload = multer({ storage: storage });

exports.register = async (req, res) => {
    // Use upload.single middleware to handle file upload
    upload.single('picture')(req, res, async (err) => { 
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      const { name, email, password } = req.body;
      const picture = req.file ? req.file.filename : null; // Get filename if uploaded
  
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password,
            picture, // Store filename in the database
          },
        });
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  };