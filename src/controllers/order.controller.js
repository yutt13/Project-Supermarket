const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
    try {
      const { customerId, products } = req.body; // รับข้อมูลลูกค้าและสินค้า
      if (!customerId || !products || !products.length) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
      }
  
      // สร้างออเดอร์ใหม่
      const order = await prisma.order.create({
        data: {
          customerId: parseInt(customerId),
          OrderItems: {
            create: products.map((product) => ({
              productId: parseInt(product.productId),
              quantity: product.quantity,
            })),
          },
        },
        include: {
          OrderItems: true,
        },
      });
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างออเดอร์' });
    }
  };
  
  // ดึงข้อมูลออเดอร์ทั้งหมด
  exports.getOrders = async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          Customer: true, // รวมข้อมูลลูกค้า
          OrderItems: {
            include: {
              Product: true, // รวมข้อมูลสินค้า
            },
          },
        },
      });
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์' });
    }
  };
  
  // ดึงข้อมูลออเดอร์ตาม ID
  exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          Customer: true,
          OrderItems: {
            include: {
              Product: true,
            },
          },
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลออเดอร์นี้' });
      }
  
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์' });
    }
  };
  