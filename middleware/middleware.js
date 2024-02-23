const jwt = require('jsonwebtoken');
const JWT_Key = process.env.JWT_Key;
/**
 * JWT authorization
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

const authorize = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_Key);
    req.decoded = payload;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = { authorize };
