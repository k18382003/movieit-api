const knex = require('knex')(require('../knexfile'));

const fetchParticipants = async (req, res) => {
  const participants = await knex('participants as pt')
    .select('pt.event_id', 'pr.displayname', 'pt.user_id')
    .join('profile as pr', 'pt.user_id', 'pr.user_id')
    .where({
      event_id: req.params.eventId,
    });

  return res.status(200).json(participants);
};

const AddParticipant = async (req, res) => {
  const participant = {
    user_id: req.body.user_id,
    event_id: req.body.event_id,
    ishost: false,
  };

  await knex('participants').insert(participant);

  return res.status(200).json(participant);
};

const DeleteParticipant = async (req, res) => {
 try {
   const result = await knex('participants')
     .where({ user_id: req.params.userId, event_id: req.params.eventId })
     .del();
 
   return res.status(200).json(result);
 } catch (err) {
   // Return Internal Server Error 500, if the error occurs at the backend
   return res.status(500).json({ message: `Failed signing up: ${err}` });
 }
};

module.exports = {
  fetchParticipants,
  AddParticipant,
  DeleteParticipant,
};
