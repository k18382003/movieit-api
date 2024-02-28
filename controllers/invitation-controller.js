const knex = require('knex')(require('../knexfile'));

const fetchInvitations = async (req, res) => {
  try {
    const fetchInvitations = await knex('invitation as i')
      .select('i.*', 'pr.displayname', 'pr.photo_url')
      .join('profile as pr', 'pr.user_id', 'i.sender')
      .where({
        receiver: req.params.userId,
        need_action: true,
      });
    return res.status(200).json(fetchInvitations);
  } catch (error) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetchInvitations: ${error}` });
  }
};

const fetchUnreadInvitation = async (req, res) => {
  try {
    const fetchInvitations = await knex('invitation').where({
      receiver: req.params.userId,
      read_time: null,
    });
    return res.status(200).json(fetchInvitations);
  } catch (error) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetchInvitations: ${error}` });
  }
};

const addInvitations = async (req, res) => {
  try {
    await knex('invitation').insert(req.body);
    return res.status(200).json('Inserted Sucessfully');
  } catch (error) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetchInvitations: ${error}` });
  }
};

const readInvitation = async (req, res) => {
  try {
    await knex('invitation')
      .where({ receiver: req.params.userId, read_time: null })
      .update({ read_time: Date.now() });
    return res.status(200).json('Updated sucessfully!');
  } catch (error) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetchInvitations: ${error}` });
  }
};

const updateAction = async (req, res) => {
  try {
    await knex('invitation')
      .where({
        receiver: req.params.userId,
        event_id: req.body.event_id,
        sender: req.body.sender,
      })
      .update({ need_action: false });
    return res.status(200).json('Updated sucessfully!');
  } catch (error) {
    // Return Internal Server Error 500, if the error occurs at the backend
    return res
      .status(500)
      .json({ message: `Failed fetchInvitations: ${error}` });
  }
};

module.exports = {
  fetchInvitations,
  addInvitations,
  readInvitation,
  fetchUnreadInvitation,
  updateAction,
};
