const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/"); // บันทึกรูปภาพไว้ในโฟลเดอร์ images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// ตั้งค่า multer สำหรับอัปโหลดรูปภาพ
const upload = multer({ storage: storage }).single("picture"); // ใช้ field name เป็น "picture"

// 1. จัดการสินค้า
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
};

// 2. เพิ่มสินค้า
const addProduct = async (req, res) => {
  try {
    // อัปโหลดรูปภาพ
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Failed to upload image" });
      }

      // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่
      let pictureUrl = null;
      if (req.file) {
        // แปลง path ของรูปภาพเป็น URL แบบเต็ม
        pictureUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
      }

      // บันทึกข้อมูลสินค้าลงฐานข้อมูล
      const { name, price, description, stock, category_id } = req.body;
      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          description,
          stock: parseInt(stock),
          category_id,
          picture: pictureUrl, // ใช้ URL แบบเต็ม
        },
      });

      // ส่ง response กลับ
      res.status(201).json(newProduct);
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. ลบสินค้า
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
};

// 4. แก้ไขสินค้า
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, category_id, picture } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, description, stock, category_id, picture },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// 5. จัดการประเภทสินค้า
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch categories' });
  }
};

// 6. เพิ่มประเภทสินค้า
const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({ data: { name } });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add category' });
  }
};

// 7. ลบประเภทสินค้า
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete category' });
  }
};

// 8. ดูสถานะและรายละเอียดคำสั่งซื้อ
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { OrderItems: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getAllCategories,
  addCategory,
  deleteCategory,
  getOrders,
};