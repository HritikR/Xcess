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

}