const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// 📌 ลงทะเบียนลูกค้าใหม่
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await prisma.customer.create({
            data: { name, email, password: hashedPassword },
        });

        res.status(201).json({ message: "Customer registered", customer });
    } catch (error) {
        res.status(500).json({ message: "Error registering customer", error });
    }
};

// 📌 เข้าสู่ระบบลูกค้า
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await prisma.customer.findUnique({ where: { email } });

        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, customer });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// 📌 ดูข้อมูลลูกค้าทั้งหมด
exports.getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({ include: { purchases: true, reviews: true } });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers", error });
    }
};

// 📌 อัปเดตแต้มสะสมลูกค้า
exports.updatePoints = async (req, res) => {
    try {
        const { points } = req.body;
        const updatedCustomer = await prisma.customer.update({
            where: { id: req.params.id },
            data: { points },
        });

        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating points", error });
    }
};
