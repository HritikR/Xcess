const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

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

    // use method handler
    use(path, handler) {
        if (typeof path === 'function') {
            this.middlewares.push(path);
        } else {
            this.middlewares.push((req, res, next) => {
                if (req.url.startsWith(path) || path === '/' || path === '*') {
                    handler(req, res, next);
                } else {
                    next();
                }
            });
        }
    }

    // static method to handle cors
    static cors(options = {}) {
        const defaultOptions = {
            allowedOrigins: '*',
            allowedMethods: 'GET, POST, PUT, DELETE',
            allowedHeaders: 'Content-Type, Authorization',
        };

        const corsOptions = { ...defaultOptions, ...options };

        return (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', corsOptions.allowedOrigins); // Allow all origins
            res.setHeader('Access-Control-Allow-Methods', corsOptions.allowedMethods); // Allow all methods
            res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders);  // Allow all headers
            res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

            // Handle preflight request
            if (req.method === 'OPTIONS') {
                res.statusCode = 204;
                res.end();
            } else {
                next();
            }
        };
    }

    // static method to serve static files
    static static(dirPath) {
        return (req, res, next) => {
            const { url } = req;
            const filePath = path.join(dirPath, url);
            // Check if the file exists
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    // If the file does not exist, invoke the next middleware
                    next();
                } else {
                    // If the file exists, serve the file
                    const contentType = mime.getType(filePath);
                    res.setHeader('Content-Type', contentType);
                    const fileStream = fs.createReadStream(filePath);
                    fileStream.on('error', (err) => {
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    });

                    fileStream.pipe(res);
                }
            });
        };
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

    // function to handle middlewares
    #handleMiddlewares(req, res) {
        // Implement the next() function
        const next = () => {
            this.handleMiddlewares(req, res);
        };

        const currentMiddleware = this.middlewares.shift();
        if (currentMiddleware) {
            currentMiddleware(req, res, next);
        } else {
            this.#handleRequest(req, res);
        }
    }

    // Start listening on the specified port with the given callback
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this.#handleMiddlewares(req, res);
        });
        server.listen(port, callback);
    }
}

module.exports = Xpress;