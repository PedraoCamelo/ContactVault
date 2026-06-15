require('dotenv').config();
const mongoose = require('mongoose');
const { getChannel, QUEUE } = require('./lib/rabbitmq');
const Log = require('./models/Log');

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Consumer connected to MongoDB');

  const channel = await getChannel();
  console.log(`Consumer listening on queue "${QUEUE}"`);

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await Log.create(data);
      channel.ack(msg);
    } catch (err) {
      console.error('Consumer error:', err);
      channel.nack(msg, false, false);
    }
  });
}

start().catch((err) => {
  console.error('Consumer failed to start:', err);
  process.exit(1);
});
