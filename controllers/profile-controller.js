const knex = require('knex')(require('../knexfile'));
const { ValidatingFields, isEmail } = require('../utils/formValidation');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_Key = process.env.JWT_Key;

const fetchUserProfile = async (req, res) => {
  const userProfile = await knex('profile')
    .where({ user_id: req.params.id })
    .first();

  if (!userProfile) {
    return res.status(404).json({
      message: `User with UserID ${req.params.id} not found`,
    });
  }

  return res.status(200).json(userProfile);
};

const editUserProfile = async (req, res) => {
  const rowsUpdated = await knex('profile')
    .where({ user_id: req.params.id })
    .update(req.body);

  if (rowsUpdated === 0) {
    return res.status(404).json({
      message: `User with ID ${req.params.id} not found`,
    });
  }

  const updatedUserProfile = await knex('profile').where({
    id: req.params.id,
  });

  return res.json(updatedUserProfile[0]);
};

const getProfileByArea = async (req, res) => {
  let postCodes = req.params.postalcode
    .split('&')
    .map((item) => "'" + item + "'")
    .join(',');
  const profiles = await knex('profile as p')
    .select('p.*')
    .where(knex.raw(`replace(p.postalcode, " ", "") in (${postCodes})`));

  return res.json(profiles);
};

module.exports = {
  fetchUserProfile,
  editUserProfile,
  getProfileByArea,
};
