const Order = require("../models/Order.js");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");

//Create Cart
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Cart.aggregate(req.body);

  try {
    const savedOrder = await Order.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update cart
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("order successfully deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get User's order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    let orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  let date = new Date();
  let lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  let previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    let income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "sales" },
        },
      },
    ]);
  } catch (err) {
    res.status(err).json(err);
  }
});

module.exports = router;
