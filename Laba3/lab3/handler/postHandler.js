const url = require("url");

const errorHandler = require("./errH");

let POST_handler = (req, res, db) => {
    let data_json = '';
    let path = decodeURI(url.parse(req.url).pathname);

    switch (true) {
        case path == '/api/faculties':
            
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Faculty.create({faculty: data_json.faculty, faculty_name: data_json.faculty_name})
                        .then(faculty =>
                            {
                                res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                                res.end(JSON.stringify(faculty));
                            })
                        .catch((err) => {errorHandler(res, 3, 'Such faculty exist');
                    })
                });
            break;
        case path == '/api/pulpits':
            
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Pulpit.create({
                        pulpit: data_json.pulpit,
                        pulpit_name: data_json.pulpit_name,
                        faculty: data_json.faculty
                    })
                        .then(pulpit => {
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            res.end(JSON.stringify(pulpit));
                        })
                        .catch((err) => {errorHandler(res, 3, 'Such pulpit exist');})
                });
            break;
        case path == '/api/subjects':

            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Subject.create({
                        subject: data_json.subject,
                        subject_name: data_json.subject_name,
                        pulpit: data_json.pulpit
                    })
                        .then(subject => {
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            res.end(JSON.stringify(subject));
                        })
                        .catch((err) => {errorHandler(res, 3, 'Such subject exist');})
                });
            break;
        case path == '/api/teachers':

            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Teacher.create({
                        teacher: data_json.teacher,
                        teacher_name: data_json.teacher_name,
                        pulpit: data_json.pulpit
                    })
                        .then(teacher => {
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            res.end(JSON.stringify(teacher))
                        })
                        .catch((err) => {errorHandler(res, 3,'Such teacher  exist');})
                });
            break;
        case path == '/api/auditoriumstypes':

            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Auditorium_type.create({
                        auditorium_type: data_json.auditorium_type,
                        auditorium_typename: data_json.auditorium_typename
                    })
                        .then(subject => {
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            res.end(JSON.stringify(subject));
                        })
                        .catch((err) => {errorHandler(res, 3, 'Such auditorium type exist');})
                });
            break;
        case path == '/api/auditoriums':

            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    db.Auditorium.create({
                        auditorium: data_json.auditorium,
                        auditorium_name: data_json.auditorium_name,
                        auditorium_capacity: data_json.auditorium_capacity,
                        auditorium_type: data_json.auditorium_type
                    })
                        .then(subject => res.end(JSON.stringify(subject)))
                        .catch((err) => {errorHandler(res, 3, 'Such auditorium  exist');})
                });
            break;
            default:
                res.end(JSON.stringify("method allow"))
                break;
    }
}

module.exports = POST_handler;