const { db } = require('./store');

function generateSubscriptionCode(plan, days = 30) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i += 1) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const item = {
    code,
    plan,
    days,
    used: false,
    createdAt: new Date().toISOString(),
    usedBy: null,
  };

  db.subscriptionCodes.push(item);
  return item;
}

function redeemCode(user, code) {
  const found = db.subscriptionCodes.find((item) => item.code === code && !item.used);
  if (!found) {
    throw new Error('Invalid or already used code');
  }

  found.used = true;
  found.usedBy = user.id;
  const now = new Date();
  const endDate = new Date(now.getTime() + found.days * 24 * 60 * 60 * 1000);

  user.plan = found.plan;
  user.subscriptionEndsAt = endDate.toISOString();

  return {
    message: 'Subscription activated successfully',
    plan: user.plan,
    subscriptionEndsAt: user.subscriptionEndsAt,
  };
}

module.exports = { generateSubscriptionCode, redeemCode };
