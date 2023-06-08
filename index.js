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

    // POST method handler
    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    // PUT method handler
    put(path, handler) {
        this.routes.PUT[path] = handler;
    }

    // DELETE method handler
    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    // ALL method handler
    all(path, handler) {
        this.routes.ALL[path] = handler;
    }

    // Start listening on the specified port with the given callback
    listen(port, callback) {
        const server = http.createServer();
        server.listen(port, callback);
    }
}