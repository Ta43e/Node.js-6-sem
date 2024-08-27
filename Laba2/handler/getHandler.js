const url = require("url");
const fs = require("fs");
const http = require("http");
const errorHandler = require("./errH");

let GET_handler = (req, res, db) => {
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split("/");

    switch (true) {
        case path == "/api/faculties":
            db.Faculty.findAll().then(faculties => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(faculties))}
                )
                .catch((err) => { errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/pulpits":
            db.Pulpit.findAll().then(pulpits => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(pulpits))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/subjects":
            db.Subject.findAll().then(subjects => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(subjects))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/teachers":
            db.Teacher.findAll().then(teachers => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

                res.end(JSON.stringify(teachers))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/auditoriumtypes":
            db.Auditorium_type.findAll().then(auditoriumstypes => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(auditoriumstypes))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/auditoriums": 
            db.Auditorium.findAll().then(auditoriums => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(auditoriums))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/scope":
            db.Auditorium.scope('scope_auditorium').findAll().then(count => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(count))}
                )
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/":
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let page = fs.readFileSync('./index.html');
            res.end(page)
            break;
        case path == `/api/auditoriumtypes/${pathParameters[3]}/auditoriums`:

            db.Auditorium.findAll({where: {auditorium_type: pathParameters[3]},})
                .then((values) => {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    console.log(JSON.stringify(values));
                    res.end(JSON.stringify(values));})
                .catch((err) => { errorHandler(res, 2, 'Not Found');
            });
            break;
        case path == `/api/faculty/${pathParameters[3]}/subjects`:

            db.Faculty.hasMany(db.Pulpit, {foreignKey: "faculty",sourceKey: "faculty",});
            db.Pulpit.hasMany(db.Subject, {foreignKey: "pulpit",sourceKey: "pulpit",});
            db.Faculty.findAll({where: { faculty: pathParameters[3] },
                include: [{
                    model: db.Pulpit,
                    attributes: ["pulpit_name"],
                    required: true,
                    include: [{model: db.Subject, required: true,},],
                },],})
            .then((values) => {
                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                res.end(JSON.stringify(values));})
            .catch((err) => {errorHandler(res, 2, 'Not Found');});
            break;            
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

module.exports = GET_handler;