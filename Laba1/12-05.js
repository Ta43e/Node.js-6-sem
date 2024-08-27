const redis = require('redis');

// Создаем клиенты Redis
const publisherClient = redis.createClient();
const subscriberClient = redis.createClient();

// Подписываемся на канал 'article'
subscriberClient.subscribe('article');

subscriberClient.on('message', (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);
});

subscriberClient.on('subscribe', (channel, count) => {
    // Как только подписка установлена, отправляем сообщение от издателя
    publisherClient.publish('article', 'ddd');
});