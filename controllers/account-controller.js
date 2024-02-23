const knex = require('knex')(require('../knexfile'));
const { ValidatingFields, isEmail } = require('../utils/formValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

    // encrypted password
    const hashedPsw = bcrypt.hashSync(req.body.password);

    // new user data
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPsw,
    };

    const userId = await knex('user').insert(user);
    const profileId = await knex('profile').insert({
      user_id: userId,
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
      let token = jwt.sign(
        { username: user.username, userId: user.id },
        JWT_Key
      );
      return res.status(200).json({ token: token });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.status(500).send(`Error retrieving Users: ${err}`);
  }
};

module.exports = {
  signUp,
  signIn,
};
