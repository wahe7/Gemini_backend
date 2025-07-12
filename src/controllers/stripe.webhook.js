const stripe = require("../config/stripe");
const prisma = require("../config/db");

exports.webhook_response = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = parseInt(session.metadata.userId);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { subscription: 'PRO' },
      });

      console.log(`User ${userId} upgraded to PRO`);
    } catch (err) {
      console.error('Failed to update user tier:', err.message);
    }
  }

  res.json({ received: true });
};
