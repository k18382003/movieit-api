const knex = require('knex')(require('../knexfile'));

const fetchParticipants = async (req, res) => {
  const participants = await knex('participants as pt')
    .select('pt.event_id', 'pr.displayname', 'pt.user_id', 'pr.photo_url')
    .join('profile as pr', 'pt.user_id', 'pr.user_id')
    .where({
      event_id: req.params.eventId,
    });
  return res.status(200).json(participants);
};

module.exports = {
  fetchParticipants,
};
