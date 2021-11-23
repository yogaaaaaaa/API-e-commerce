const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    jwt.verify(token, proess.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("token is invalid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authorized!");
  }
};

const verifyTokenAndAuthorization = (req, res, next)=>{
  verifyToken(req, res,()=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }else{
      res.status(403).json("you are not allowed to do that!");
    }
  })
}

module.exports = {verifyToken, verifyTokenAndAuthorization}