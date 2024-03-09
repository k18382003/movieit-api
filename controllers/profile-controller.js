const knex = require('knex')(require('../knexfile'));
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

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

cloudinary.config({
  cloud_name: process.env.CloudinaryName,
  api_key: process.env.Cloudinary_API_Key,
  api_secret: process.env.Cloudinary_API_Secrete,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: 'auto',
  width: 250,
  height: 250,
  quality: 'auto',
  fetch_format: 'auto',
  crop: 'fill',
};

const upload = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

const uploadPhoto = async (req, res) => {
  try {
    const result = await upload(req.body.image);
    await knex('profile')
      .where({ user_id: req.params.id })
      .update({ photo_url: result });
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getNumHostedEvents = async (user_id) => {
  const result = await knex('event').where({ host: user_id }).count();
  return result;
};

const getNumInvitations = async (user_id) => {
  const result = await knex.raw(
    `With cte1 as (SELECT count(*) send FROM invitation where sender = ${user_id}), 
      cte2 as (SELECT count(*) received FROM invitation where receiver = ${user_id}) 
      SELECT send, received FROM cte1 join cte2`
  );
  return result[0];
};

const getNumPastMovieBuddies = async (user_id) => {
  const result = await knex.raw(
    `with
      cte1 as (SELECT event_id as event_id from participants where user_id = ${user_id})
      SELECT count(*) people FROM cte1 
      join participants p 
      join event e on e.id = p.event_id
      where p.event_id = cte1.event_id 
      and STR_TO_DATE(e.show_time,'%W %M %d %Y %H:%i') < now()
      and p.user_id != ${user_id};`
  );

  return result[0];
};

const getMetrics = async (req, res) => {
  try {
    const hostedEvent = await getNumHostedEvents(req.params.id);
    const eventData = await getNumInvitations(req.params.id);
    const movieBudies = await getNumPastMovieBuddies(req.params.id);
    const metrics = [
      {
        description: 'Total Hosted Event',
        number: hostedEvent[0]['count(*)'],
      },
      {
        description: 'Total Invitation Received',
        number: eventData[0].received,
      },
      {
        description: 'Total Invitation Sent',
        number: eventData[0].send,
      },
      {
        description: 'People Watched Movie With',
        number: movieBudies[0].people,
      },
    ];
    return res.status(200).json(metrics);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  fetchUserProfile,
  editUserProfile,
  getProfileByArea,
  uploadPhoto,
  getMetrics,
};
