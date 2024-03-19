const knex = require('knex')(require('../knexfile'));
const { ValidatingFields } = require('../utils/formValidation');
const cloudinary = require('cloudinary').v2;

const fetchEvents = async (req, res) => {
  try {
    const { eventnum } = req.headers;
    const events = await knex('event')
      .orderBy('show_time', 'desc')
      .offset(eventnum - 6)
      .limit(6);

    // Only return new events
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const fetchEventDetail = async (req, res) => {
  const details = await knex('event').where({ id: req.params.id }).first();

  if (!details) {
    return res.status(404).json({
      message: `Event with eventId ${req.params.id} not found`,
    });
  }

  return res.status(200).json(details);
};

const fetchMyEvents = async (req, res) => {
  const myevents = await knex('participants as p')
    .select(
      'p.ishost',
      'p.event_id as id',
      'e.movie_name',
      'e.show_time',
      'e.cinema',
      'e.photo_url'
    )
    .join('event as e', 'p.event_id', 'e.id')
    .where({ 'p.user_id': req.params.id });

  return res.status(200).json(myevents);
};

const addEvent = async (req, res) => {
  try {
    const requireField = [
      'movieName',
      'showTime',
      'cinema',
      'postalcode',
      'address',
      'host',
    ];

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

    // new event data
    const event = {
      movie_name: req.body.movieName,
      show_time: req.body.showTime,
      cinema: req.body.cinema,
      postal_code: req.body.postalcode,
      address: req.body.address,
      host: req.body.host,
      notes: req.body.notes,
      max_people: req.body.max,
      photo_url: req.body.photo_url,
    };

    const eventId = await knex('event').insert(event);

    // default participiant
    const participant = {
      user_id: req.body.host,
      event_id: eventId,
      ishost: true,
    };

    await knex('participants').insert(participant);

    return res.status(201).json({ ...req.body, eventId: eventId });
  } catch (err) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res.status(500).json({ message: `Failed signing up: ${err}` });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const result = await knex('event').where({ id: req.params.id }).del();

    return res.status(200).json(result);
  } catch (err) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res.status(500).json({ message: `Failed signing up: ${err}` });
  }
};

const myNextEvent = async (req, res) => {
  try {
    const result = await knex('event as e')
      .select('e.*')
      .join('participants as p', 'p.event_id', 'e.id')
      .where({ 'p.user_id': req.params.id });
    let newNext = result.filter(
      (e) => new Date(e.show_time).getTime() > Date.now()
    );

    if (!!newNext) {
      console.log('here');
      return res.status(200).json(newNext);
    }

    newNext.sort((a, b) => Date.parse(a.show_time) - Date.parse(b.show_time));
    return res.status(200).json(newNext[0]);
  } catch (err) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetching nextEvent: ${err}` });
  }
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
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  fetchEvents,
  fetchEventDetail,
  fetchMyEvents,
  addEvent,
  deleteEvent,
  myNextEvent,
  uploadPhoto,
};
