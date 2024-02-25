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
    .select(
      'p.ishost',
      'p.event_id',
      'e.movie_name',
      'e.show_time',
      'e.cinema'
    )
    .join('event as e', 'p.event_id', 'e.id')
    .where({ 'p.user_id': req.params.id });

  return res.status(200).json(myevents);
};

module.exports = {
  fetchEvents,
  fetchEventDetail,
  fetchMyEvents,
};
