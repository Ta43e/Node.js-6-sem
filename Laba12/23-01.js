const express = require('express');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Телефонный справочник API",
      version: "1.0.0",
      description: "REST API для управления телефонным справочником"
    },
    servers: [
      {
        url: "http://localhost:3006"
      }
    ]
  },
  apis: ["./23-01.js"] 
};

const openapiSpecification = swaggerJSDoc(options);

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));  

const phonebookFile = './book.json';
function readPhonebook() {
    try {
        const data = fs.readFileSync(phonebookFile, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Failed to read phonebook:', error);
        return [];
    }
}
function writePhonebook(phonebook) {
    try {
        const data = JSON.stringify(phonebook);
        fs.writeFileSync(phonebookFile, data, 'utf-8');
    }
    catch (error) {
        console.error('Failed to write phonebook:', error);
    }
}
app.get('/TS', (req, res) => {
    const phonebook = readPhonebook();
    res.json(phonebook);
});
app.post('/TS', (req, res) => {
    const { id, name, phoneNumber } = req.body;
    const phonebook = readPhonebook();
    
    const existingPhone = phonebook.find(phone => phone.id === id);
    if (existingPhone) {
        return res.status(409).send('Контакт с таким id уже существует');
    }

    const newPhone = { id, name, phoneNumber };
   
    phonebook.push(newPhone);
    writePhonebook(phonebook);
    res.sendStatus(201);
});
app.put('/TS', (req, res) => {
    const { id, name, phoneNumber } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    }
    else {
        phonebook[phoneIndex] = { id, name, phoneNumber };
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});
app.delete('/TS', (req, res) => {
    const { id } = req.body;
    const phonebook = readPhonebook();
    const phoneIndex = phonebook.findIndex((phone) => phone.id === id);
    if (phoneIndex === -1) {
        res.sendStatus(404);
    }
    else {
        phonebook.splice(phoneIndex, 1);
        writePhonebook(phonebook);
        res.sendStatus(200);
    }
});
app.listen(3006, () => {
    console.log('Server is running on port 3006');
});


/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneEntry:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - phoneNumber
 *       properties:
 *         id:
 *           type: number
 *           description: Айди владельца телефона
 *         name:
 *           type: string
 *           description: Имя владельца телефона
 *         phoneNumber:
 *           type: string
 *           description: Телефонный номер
 */

/**
 * @swagger
 * /TS:
 *   get:
 *     summary: Получить полный список телефонов
 *     responses:
 *       200:
 *         description: Список телефонов получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PhoneEntry'
 *   post:
 *     summary: Добавить новый телефон в справочник
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneEntry'
 *     responses:
 *       201:
 *         description: Телефон добавлен в справочник
 *   put:
 *     summary: Обновить телефон в справочнике
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneEntry'
 *     responses:
 *       201:
 *         description: Телефон обновлен в справочнике
 *   delete:
 *     summary: Удалить телефон из справочника
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneEntry'
 *     responses:
 *       201:
 *         description: Телефон удален из справочника
 */