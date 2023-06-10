const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

class Xcess {
    /**
     * Initialize the Xcess instance with empty routes and middlewares
     */
    constructor() {
        // Initialize the routes object with different HTTP methods
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

    /**
     * Add a GET route handler
     * @param {string} path - The route path
     * @param {function} handler - The handler function for the route
     */
    get(path, handler) {
        this.routes.GET[path] = handler;
    }

    /**
     * Add a POST route handler
     * @param {string} path - The route path
     * @param {function} handler - The handler function for the route
     */
    post(path, handler) {
        this.routes.POST[path] = handler;
    }

    /**
     * Add a PUT route handler
     * @param {string} path - The route path
     * @param {function} handler - The handler function for the route
     */
    put(path, handler) {
        this.routes.PUT[path] = handler;
    }

    /**
     * Add a DELETE route handler
     * @param {string} path - The route path
     * @param {function} handler - The handler function for the route
     */
    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }

    /**
     * Add a route handler for all HTTP methods
     * @param {string} path - The route path
     * @param {function} handler - The handler function for the route
     */
    all(path, handler) {
        this.routes.ALL[path] = handler;
    }

    /**
     * Add a middleware handler
     * @param {string|function} path - The path or the middleware function
     * @param {function} handler - The handler function for the middleware
     */
    use(path, handler) {
        if (typeof path === 'function') {
            // If the path is a function, it is a global middleware
            this.middlewares.push(path);
        } else {
            // If the path is a string, it is a path-based middleware
            this.middlewares.push((req, res, next) => {
                if (req.url.startsWith(path) || path === '/' || path === '*') {
                    handler(req, res, next);
                } else {
                    next();
                }
            });
        }
    }

    /**
     * Handle Cross-Origin Resource Sharing (CORS)
     * @param {object} options - The CORS options
     * @returns {function} - The CORS middleware function
     */
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

    /**
     * Serve static files from a directory
     * @param {string} dirPath - The directory path to serve static files from
     * @returns {function} - The static file middleware function
     */
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

    /**
     * Route the request to the respective method handlers
     * @private
     * @param {http.IncomingMessage} req - request object
     * @param {http.ServerResponse} res - response object
     */
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

    /**
     * Handle the middleware stack
     * @private
     * @param {http.IncomingMessage} req - request object
     * @param {http.ServerResponse} res - response object
     */
    #handleMiddlewares(req, res) {
        const next = () => {
            this.#handleMiddlewares(req, res);
        };

        const currentMiddleware = this.middlewares.shift();
        if (currentMiddleware) {
            currentMiddleware(req, res, next);
        } else {
            this.#handleRequest(req, res);
        }
    }

    /**
     * Start listening on the specified port with the given callback
     * @param {number} port - The port number to listen on
     * @param {function} callback - The callback function to be executed on successful server start
     */
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            // Add the status method to the response object
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };

            // Add the json method to the response object
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            };

            // Add the send method to the response object
            res.send = (body) => {
                if (typeof body === 'object') {
                    res.json(body);
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(body);
                }
            };

            this.#handleMiddlewares(req, res);
        });
        server.listen(port, callback);
    }
}

module.exports = Xcess;