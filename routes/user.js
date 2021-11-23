const router = require("express").Router();
const {verifyToken} = require('./verifyToken.js')

router.put("/id:", verifyToken, (req, res)=>{
  if(req.user.id === req.params.id || req.user.isAdmin){

  }
});



module.exports = router;
