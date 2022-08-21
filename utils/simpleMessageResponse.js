/**
 * Used to return a very simple response to the client
 * @param {object} res
 * @param {number} status
 * @param {string} message
 */
const simpleMessageResponse = (res, status, message) => {
  res.status(status).json({ message });
};

module.exports = { simpleMessageResponse };
