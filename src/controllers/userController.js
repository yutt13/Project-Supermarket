const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// 1. ลงทะเบียน
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await prisma.customer.create({
      data: { name, email, password, role: 'USER' },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

// 2. เข้าสู่ระบบ
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.customer.findUnique({ where: { email } });
    if (user && user.password === password) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
};

// 3. จัดการข้อมูลผู้ใช้งาน
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const updatedUser = await prisma.customer.update({
      where: { id },
      data: { name, email, password },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// 4. ค้นหาสินค้า/เรียกดูสินค้า
const searchProducts = async (req, res) => {
  const { keyword } = req.body;
  try {
    const products = await prisma.product.findMany({
      where: { name: { contains: keyword, mode: 'insensitive' } },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Search failed' });
  }
};

// 5. ดูรายการสินค้าพร้อมหมวดหมู่
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { category_id: categoryId },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
};

// 6. เพิ่มสินค้าลงตะกร้า
const addToCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;
  
    try {
      // 1️⃣ ตรวจสอบว่าผู้ใช้มีตะกร้าแล้วหรือไม่
      let cart = await prisma.cart.findUnique({
        where: { customerId },
      });
  
      // 2️⃣ ถ้าไม่มี ให้สร้างตะกร้าใหม่
      if (!cart) {
        cart = await prisma.cart.create({
          data: { customerId },
        });
      }
  
      // 3️⃣ ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าหรือยัง
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });
  
      if (existingCartItem) {
        // 4️⃣ ถ้ามีอยู่แล้ว ให้อัปเดตจำนวนสินค้า
        const updatedCartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
  
        return res.status(200).json(updatedCartItem);
      } else {
        // 5️⃣ ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่ลงตะกร้า
        const newCartItem = await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity },
        });
  
        return res.status(201).json(newCartItem);
      }
    } catch (error) {
      res.status(400).json({ error: 'Failed to add to cart' });
    }
  };

// 7. ดำเนินการสั่งซื้อ
const createOrder = async (req, res) => {
    const { customerId } = req.body;
    try {
      // 1️⃣ ค้นหาตะกร้าสินค้าของลูกค้า
      const cart = await prisma.cart.findUnique({
        where: { customerId },
        include: { items: true }, // ดึงสินค้าทั้งหมดที่อยู่ในตะกร้า
      });
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
  
      // 2️⃣ ตรวจสอบว่าสินค้ามีสต็อกเพียงพอหรือไม่
      for (const item of cart.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
  
        if (!product || product.stock < item.quantity) {
          return res.status(400).json
        }
      }
  
      // 3️⃣ สร้างคำสั่งซื้อจากรายการสินค้าใน Cart
      const newOrder = await prisma.order.create({
        data: {
          customerId,
          OrderItems: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
          status: "Pending",
        },
      });
  
      // 4️⃣ ลดจำนวนสินค้าในสต็อก
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // ลดสต็อกตามจำนวนที่สั่งซื้อ
            },
          },
        });
      }
  
      // 5️⃣ ลบสินค้าทั้งหมดออกจากตะกร้า
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create order" });
    }
  };

module.exports = {
  register,
  login,
  updateUser,
  searchProducts,
  getProductsByCategory,
  addToCart,
  createOrder,
};