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

    // function to route the request to respective method handlers
    #handleRequest(req, res) {
        const { method, url } = req;
        const routeHandler = this.routes[method][url] || this.routes.ALL[url];
        if (routeHandler) {
            routeHandler(req, res);
        } else {
            res.statusCode = 404;
            res.end(`Cannot ${method} ${url}`);
        }
    }

    // Start listening on the specified port with the given callback
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this.#handleRequest(req, res);
        });
        server.listen(port, callback);
    }
}

module.exports = Xpress;