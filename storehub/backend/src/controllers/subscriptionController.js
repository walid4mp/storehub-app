const { redeemCode } = require('../services/codeService');

function activateSubscriptionCode(req, res) {
  const { code } = req.body;
  if (!code || code.length !== 12) {
    return res.status(400).json({ message: '12-character subscription code required' });
  }

  try {
    const result = redeemCode(req.user, code.toUpperCase());
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { activateSubscriptionCode };
