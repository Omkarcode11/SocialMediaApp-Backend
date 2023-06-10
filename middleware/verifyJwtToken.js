const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    const secKey = process.env.SECRET_KEY;
    if (!token) return res.status(201).send("Missing authorization header");

    token = token.split(" ")[1];


    if (!token) return res.status(201).send("Missing token");

    let isValid = jwt.verify(token, secKey);

    if (isValid.id == req.body.userId || req.params.id) {
       req.userId = isValid.id
      next();
    }
    else return res.status(200).send(isValid)
  } catch (err) {
    res.status(200).json(err.message);
    return;
  }
};

module.exports = { verify };
