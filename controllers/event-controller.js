const knex = require('knex')(require('../knexfile'));

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
  const details = await knex('event')
    .where({ id: req.params.id })
    .first();

  if (!details) {
    return res.status(404).json({
      message: `Event with event ${req.params.id} not found`,
    });
  }

  return res.status(200).json(details);
};

const fetchMyEvents = async (req, res) => {
  const details = await knex('event').where({ user_id: req.params.id }).first();

  if (!details) {
    return res.status(404).json({
      message: `Event with event ${req.params.id} not found`,
    });
  }

  return res.status(200).json(details);
};

module.exports = {
  fetchEvents,
  fetchEventDetail,
};
