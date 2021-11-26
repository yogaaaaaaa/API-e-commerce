const Cart = require("../models/Cart.js");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");

//Create Cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart.aggregate(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart successfully deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get User's cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    let carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
