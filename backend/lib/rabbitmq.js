const amqp = require('amqplib');

const QUEUE = 'logs';

let channel = null;

async function getChannel() {
  if (channel) return channel;
  const connection = await amqp.connect(process.env.RABBITMQ_URI);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  return channel;
}

async function publish(data) {
  const ch = await getChannel();
  ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)), { persistent: true });
}

module.exports = { getChannel, publish, QUEUE };
