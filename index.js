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

    // GET method handler
    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    // Start listening on the specified port with the given callback
    listen(port, callback) {
        const server = http.createServer();
        server.listen(port, callback);
    }
}