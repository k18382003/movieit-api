const knex = require('knex')(require('../knexfile'));
const { ValidatingFields, isEmail } = require('../utils/formValidation');

const fetchEvents = async (req, res) => {
  const events = await knex('event');

  if (!events) {
    return res.status(404).json({
      message: `Event with EventID ${req.params.id} not found`,
    });
  }

  return res.status(200).json(events);
};

const fetchEventDetail = async (req, res) => {
  const details = await knex('event').where({ id: req.params.id }).first();

  if (!details) {
    return res.status(404).json({
      message: `Event with event ${req.params.id} not found`,
    });
  }

  return res.status(200).json(details);
};

const fetchMyEvents = async (req, res) => {
  const myevents = await knex('participants as p')
    .select('p.ishost', 'p.event_id', 'e.movie_name', 'e.show_time', 'e.cinema')
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
    };

    const eventId = await knex('event').insert(event);

    // default participiant
    const participant = {
      user_id: req.body.host,
      event_id: eventId,
      ishost: true,
    };

    await knex('participants').insert(participant);

    return res.status(201).json(req.body);
  } catch (err) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res.status(500).json({ message: `Failed signing up: ${err}` });
  }
};

module.exports = {
  fetchEvents,
  fetchEventDetail,
  fetchMyEvents,
  addEvent,
};
