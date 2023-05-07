const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    const secKey = process.env.SECRET_KEY;
    if (!token) return res.status(401).send("Missing authorization header");
    
    token = token.split(" ")[1];


    if (!token) return res.status(401).send("Missing token");

    let isValid = jwt.verify(token, secKey);

    if (isValid.id==req.body.userId || req.params.id) next();

    else return res.status(401).send("Invalid Token");
    
  } catch (err) {
    res.status(400).json(err.message);
    return;
  }
};

module.exports = { verify };
