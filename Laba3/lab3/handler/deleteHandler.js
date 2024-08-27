const url = require("url");

const errorHandler = require("./errH");

let DELETE_handler = (req, res, db) => {
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split('/');
    let data_json  = '';
   
    
    switch ('/api/' +pathParameters[2]) {
        case '/api/faculties':
            db.Faculty.findAll({where: {faculty: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(result));
                    }
                    else {throw new Error();}
                    db.Faculty.destroy({where: {faculty: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); });            
            break;

        case '/api/pulpits':
            db.Pulpit.findAll({where: {pulpit: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(result));
                    }
                    else {throw new Error();}                    
                    db.Pulpit.destroy({where: {pulpit: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); });            
            break;

        case '/api/subjects':
            db.Subject.findAll({where: {subject: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(result));
                    }
                    else {throw new Error();}
                    db.Subject.destroy({where: {subject: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;

        case '/api/teachers':
            db.Teacher.findAll({where: {teacher: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(result));
                    }
                    else {throw new Error();}                    
                    db.Teacher.destroy({where: {teacher: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;

        case '/api/auditoriumstypes':
            db.Auditorium_type.findAll({where: {auditorium_type: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(result));
                    }
                    else {throw new Error();}  
                    db.Auditorium_type.destroy({where: {auditorium_type: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3,'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;

        case '/api/auditoriums':
            db.Auditorium.findAll({where: {auditorium: pathParameters[3]}})
            .then(result => {  
                if (result !='') {
                    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    res.end(JSON.stringify(result));
                }
                else {throw new Error();}  
                db.Auditorium.destroy({where: {auditorium: pathParameters[3]}})
                    .then(result => {
                        if (result == 1) {JSON.stringify('delete');}
                        else {throw new Error();}})
                    .catch(error => { errorHandler(res, 3,'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;

        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

module.exports = DELETE_handler;