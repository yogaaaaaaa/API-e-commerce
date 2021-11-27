const Product = require("../models/Product.js");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken.js");

//Create Product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All products
router.get("/", async (req, res) => {
  let qNew = req.query.new;
  let qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update Products
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json("Product has been successfully deleted....");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //Update user
// router.put("/:id", verifyToken, async (req, res) => {
//   if (req.user.id === req.params.id || req.user.isAdmin) {
//     if (req.body.password) {
//       req.body.password = CryptoJS.AES.encrypt(
//         req.body.password,
//         process.env.PASS_SEC
//       ).toString();
//     }
//     try {
//       const updateUser = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );
//       res.status(200).json(updateUser);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// });

// //Delete User
// router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json("User succesfully deleted !");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //Get user
// router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     //Using spread operator, so the password wont be shown to user
//     const { password, ...others } = user._doc;

//     res.status(200).json(others);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //Get All User
// router.get("/", verifyTokenAndAdmin, async (req, res) => {
//   const query = req.query.new;
//   try {
//     const users = query
//       ? await User.find().sort({ _id: -1 }).limit(1)
//       : await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //Gets Users Stats
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await User.aggregate([
//       { $match: { createdAt: { $gte: lastYear } } },
//       { $project: { month: { $month: "$createdAt" }, }, },
//       { $group: { _id: "$month", total: { $sum: 1 }, },},
//     ]);
//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

module.exports = router;
