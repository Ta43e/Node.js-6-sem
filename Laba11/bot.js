const TelegramBot = require('node-telegram-bot-api');
const token = '6992934387:AAFX24ZHoIkBrDKwNA2YzuHBb0x4R23K2c4';
const request = require('request');
const bot = new TelegramBot(token, { polling: true });
const THE_CAT_API_KEY = "live_UjP8C4WO6HYxlI1TKFpmfU5L0rGrOT7qpWMpIxnvjHnHAOBADF6zhIb2cUp41Vzo";
const THE_API_KEY = "fVEJ0LT1W00wcZGXMl/ovg==vYtwZpVHObKoYaOM"
const axios = require('axios');
const prismaClient = require('./prisma/Clients')

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if(msg.text === null){
      return;
    }
    bot.sendMessage(chatId, msg.text); // Echo the same message back
  });

bot.onText('', async (msg) => {
    const chatId = msg.chat.id;
    
    if (msg.text.toLowerCase() === '/weather'){
        const apiKey = 'c7f6ee8d23ce6d1074e9b71bd025dbcf';
        const cityName = 'Kobrin';
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        try {
            // Отправляем GET запрос к OpenWeatherMap API
            const response = await axios.get(apiUrl);

            // Извлекаем данные о погоде из ответа
            const weatherData = response.data;
            const weatherDescription = weatherData.weather[0].description;
            const temperature = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const pressure = weatherData.main.pressure;
            const windSpeed = weatherData.wind.speed;
            const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Выводим информацию о погоде
            console.log(`Погода в ${cityName}:`);
            console.log(`Сейчас ${weatherDescription}`);
            console.log(`Температура: ${temperature}°C`);
            console.log(`Влажность: ${humidity}%`);
            console.log(`Давление: ${pressure} hPa`);
            console.log(`Скорость ветра: ${windSpeed} м/с`);
            console.log(`Время восхода солнца: ${sunrise}`);
            console.log(`Время заката солнца: ${sunset}`);

            const message = `
            Погода в ${cityName}:
            Сейчас ${weatherDescription}
            Температура: ${temperature}°C
            Влажность: ${humidity}%
            Давление: ${pressure} hPa
            Скорость ветра: ${windSpeed} м/с
            Время восхода солнца: ${sunrise}
            Время заката солнца: ${sunset}
        `;

            bot.sendMessage(chatId, message);

        } catch (error) {
            console.error('Ошибка при получении данных о погоде:', error.message);
        }
    }

    if (msg.text.toLowerCase() === 'привет') {
        const stickerFileId = 'CAACAgIAAxkBAAEE5cRmJhT0JctVxRlG9mTTVp6VRleLpwACYxcAApwROUtSkoQHG3UWlTQE'; // Укажите здесь реальный file_id стикера
        bot.sendSticker(chatId, stickerFileId).catch(error => {
          console.error(error); // В случае возникновения ошибки выведем её в консоль
        });
    }

    if(msg.text.toLowerCase() === '/subscribe'){
        console.log(chatId);
        prismaClient.subscribers.create({
            data:{
                chat_id: chatId
            }
        }).then(() => {
            bot.sendMessage(chatId, "Вы успешно подписались!");
        })
            .catch((error) => {
                if (error.code === 'P2002') {
                    // Если возникает ошибка уникальности (например, дублирующийся chatId)
                    bot.sendMessage(chatId, "Произошла ошибка при подписке. Возможно, вы уже подписаны");
                } else {
                    console.error('Ошибка при подписке:', error);
                    bot.sendMessage(chatId, "Произошла ошибка при подписке");
                }
            })
    }

    if(msg.text.toLowerCase() === '/unsubscribe'){
        prismaClient.subscribers.delete({
            where: {
                chat_id: chatId
            }
        })
            .then(() => {
                bot.sendMessage(chatId, "Вы успешно отписались.");
            })
            .catch((error) => {
                console.error('Ошибка при отписке:', error);
                bot.sendMessage(chatId, "Произошла ошибка при отписке. Возможно вы не подписаны");
            })
    }

  if (msg.text.toLowerCase() === '/joke') {

    request.get({
      url: 'https://api.api-ninjas.com/v1/jokes?limit=1',
      headers: {
        'X-Api-Key': THE_API_KEY
      },
    }, function(error, response, body) {
      if(error) {
        bot.sendMessage(chatId, 'Произошла ошибка при запросе шутки.');
        return console.error('Request failed:', error);
      } else if(response.statusCode != 200) {
        bot.sendMessage(chatId, 'Не удалось получить шутку: ' + response.statusCode);
        return console.error('Error:', response.statusCode, body.toString('utf8'));
      } else {
        
        try {
          const joke = JSON.parse(body);
          let jokeMessage = joke.map(joke => joke.joke).join('nn');
          bot.sendMessage(chatId, jokeMessage);
        } catch (parseError) {
          bot.sendMessage(chatId, 'Произошла ошибка при обработке шутки.');
          return console.error('Parse failed:', parseError);
        }
      }
    });
  };

    if(msg.text.toLowerCase() === '/cat'){

        axios.get('https://api.thecatapi.com/v1/images/search', {
            headers: {
                'x-api-key': THE_CAT_API_KEY
            }
        })
            .then(response => {
                const imageUrl = response.data[0].url;
                bot.sendPhoto(chatId, imageUrl);
            })
            .catch(error => {
                bot.sendMessage(chatId, 'Произошла ошибка при получении изображения кота.');
                console.error(error);
            });
    }
    
  });

const cron = require('node-cron');

cron.schedule('* * * * *', () => {

    prismaClient.subscribers.findMany()
        .then((subscribers) => {
            subscribers.forEach((subscriber) => {
                sendFact(subscriber.chat_id);
            });
        })
        .catch((error) => {
            console.error('Ошибка при получении подписчиков:', error);
            // Обработка ошибки при получении подписчиков
        })
  });
  
function sendFact(chatId) {
   
    request.get({
      url: 'https://api.api-ninjas.com/v1/facts',
      headers: {
        'X-Api-Key': THE_API_KEY
      },
    }, function(error, response, body) {
      if(error) {
        bot.sendMessage(chatId, 'Произошла ошибка при запросе фактов.');
        return console.error('Request failed:', error);
      } else if(response.statusCode != 200) {
        bot.sendMessage(chatId, 'Не удалось получить факты: ' + response.statusCode);
        return console.error('Error:', response.statusCode, body.toString('utf8'));
      } else {

        try {
          const facts = JSON.parse(body);
          let factsMessage = facts.map(fact => fact.fact).join('nn');
          bot.sendMessage(chatId, factsMessage);
        } catch (parseError) {
          bot.sendMessage(chatId, 'Произошла ошибка при обработке фактов.');
          return console.error('Parse failed:', parseError);
        }
      }
    });
  }








