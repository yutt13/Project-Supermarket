const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
    try {
        const { customerId, orderItems } = req.body;

        const newOrder = await prisma.order.create({
            data: {
                customerId,
                OrderItems: {
                    create: orderItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { OrderItems: true },
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                Customer: true,
                OrderItems: {
                    include: { Product: true },
                },
            },
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await prisma.order.delete({ where: { id: req.params.id } });
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
};
