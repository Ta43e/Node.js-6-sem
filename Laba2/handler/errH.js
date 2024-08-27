function errorHandler(res, code, mess) {
    res.writeHead(500, 'Error', { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`{"error": "${code}", "message": "${mess}"}`)
}
module.exports = errorHandler;