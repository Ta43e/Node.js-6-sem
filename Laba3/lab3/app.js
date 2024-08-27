
let http = require('http');
let url = require('url');
let fs = require('fs');
let Sequelize = require("sequelize");
const GET_handler =require("./handler/getHandler");
const POST_handler =require("./handler/postHandler");
const PUT_handler =require("./handler/putHandler");
const DELETE_handler =require("./handler/deleteHandler");

let sequelize =  new Sequelize('master', 'SA', '1QAZ!2wsx', {
    host: 'localhost',
    dialect: 'mssql',
    define: {
        hooks: {
            beforeBulkDestroy: (instance, options) => {console.log('before destroy');},
        }
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});

let db = require('./model').ORM(sequelize);
sequelize.authenticate()
    .then(() => {
        return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED})
            .then(t => {
                return db.Auditorium.update({ auditorium_capacity: 0 },
                    {where: { auditorium_capacity: { [Sequelize.Op.gte]: 0 } },transaction: t,})
                    .then((r) => {
                        console.log('----update----')
                        db.Auditorium.findOne({transaction: t,attributes: ["auditorium_capacity"],}).then(r => console.log(r));
                        setTimeout(() => {
                            console.log('----rollback----')
                            db.Auditorium.findOne({attributes: ["auditorium_capacity"],}).then(r => console.log(r))
                            return t.rollback();
                        }, 10000);
                    })
            })
    });

let handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            GET_handler(req, res, db);
            break;
        case 'POST':
            POST_handler(req, res, db);
            break;
        case 'PUT':
            PUT_handler(req, res, db);
            break;
        case 'DELETE':
            DELETE_handler(req, res, db);
            break;
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

http.createServer().listen(3000, () => {console.log('server.listen(3000)')}).on('request', handler);