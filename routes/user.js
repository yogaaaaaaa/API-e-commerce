const User = require("../models/User.js");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} = require("./verifyToken.js");

//Update user
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//Delete User
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
  try{
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User succesfully deleted !");
  }catch(err){
    res.status(500).json(err);
  }
})


module.exports = router;
