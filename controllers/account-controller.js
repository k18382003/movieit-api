const knex = require('knex')(require('../knexfile'));
const { ValidatingFields, isEmail } = require('../utils/formValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const JWT_Key = process.env.JWT_Key;

const signUp = async (req, res) => {
  try {
    const requireField = ['username', 'email', 'password'];

    // Validating the fields
    const valResult = ValidatingFields(req.body, requireField);
    if (valResult.checkCode === 1) {
      return res
        .status(400)
        .json({ message: `Post body not include ${valResult.field}` });
    }
    if (valResult.checkCode === 2) {
      return res
        .status(400)
        .json({ message: `${valResult.field} should not be empty` });
    }

    //Validating email
    if (!isEmail(req.body.email)) {
      return res.status(400).json({ message: `Invalid Email` });
    }

    const duplicate_emails = await knex('user')
      .where({ email: req.body.email })
      .first();

    if (duplicate_emails) {
      return res.status(400).json({ message: `This email has been taken` });
    }
    const duplicate_usernames = await knex('user')
      .where({ email: req.body.username })
      .first();

    if (duplicate_usernames) {
      return res.status(400).json({ message: `This username has been taken` });
    }

    // encrypted password
    const hashedPsw = bcrypt.hashSync(req.body.password);

    // new user data
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPsw,
    };

    const userId = await knex('user').insert(user);
    await knex('profile').insert({
      user_id: userId,
      displayname: user.username,
      username: user.username,
      postalcode: 'N/A',
    });

    return res.status(201).json(req.body);
  } catch (err) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res.status(500).json({ message: `Failed signing up: ${err}` });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await knex('user').where({ email: email }).first();

    if (user === undefined) {
      return res
        .status(400)
        .json({ message: `No such users under : ${email}` });
    }

    // decrypt password
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    // If data is correct, send a token back to user
    if (user && isPasswordCorrect) {
      const token = await generateJWTToken(user, JWT_Key, '15m');
      await generateRefreshToken(user.id, res);
      await knex('signinLog').insert({
        user_id: user.id,
      });
      const log = await knex('signinLog').where({ user_id: user.id });
      return res
        .status(200)
        .json({ token: token, first_signin: log.length == 1 });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.status(500).send(`Error retrieving Users: ${err}`);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).send(req.decoded);
};

const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { userId, username } = req.decoded;
    const oldToken = await knex('refreshToken')
      .where({
        userId: userId,
        token: refreshToken,
      })
      .first();
    if (!oldToken) return res.sendStatus(401);

    const isExpired = new Date(oldToken.expiry) < Date.now();
    const isRevoked = oldToken.revoke;

    if (isExpired || isRevoked) return res.sendStatus(401);
    const token = await generateJWTToken(
      { username: username, id: userId },
      JWT_Key,
      '15m'
    );

    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    return res.status(500).send(`Error generating refreshToken: ${err}`);
  }
};

const generateRefreshToken = async (userId, res) => {
  try {
    // Set the refresh token secret key
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Set the expiration time for the refresh token (e.g., 7 days)
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Generate the refresh token
    res.cookie('refreshToken', refreshToken, {
      expires: refreshTokenExpiry,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    await knex('refreshToken').insert({
      userId: userId,
      expiry: refreshTokenExpiry,
      token: refreshToken,
    });
  } catch (error) {
    console.log(error);
  }
};

const generateJWTToken = async (user, jwt_key, expiration) => {
  let token = jwt.sign({ username: user.username, userId: user.id }, jwt_key, {
    expiresIn: expiration,
  });

  return token;
};

module.exports = {
  signUp,
  signIn,
  getCurrentUser,
  RefreshToken,
};
