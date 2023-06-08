const http = require('http');
class Xpress {

    // Initialize the Xpress instance with empty routes and middlewares
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {},
            ALL: {}
        }

        // Initialize the middlewares array
        this.middlewares = [];
    }

    // Start listening on the specified port with the given callback
    listen(port, callback) {
        const server = http.createServer();
        server.listen(port, callback);
    }
}