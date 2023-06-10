# Xpress - Simple and Minimalistic Web Framework 

Xpress is a lightweight, express-like and easy-to-use web framework for Node.js, inspired by Express.js. It provides a simple API for creating web applications and handling HTTP requests and responses. With Xpress, you can define routes, use middleware functions, handle static file serving, and enable Cross-Origin Resource Sharing (CORS).

## Features

- Easy routing using HTTP methods (GET, POST, PUT, DELETE)
- Middleware support for request processing
- Cross-Origin Resource Sharing (CORS) handling
- Static file serving

## Installation

To install Xpress, you can use npm:

```bash
npm install xpress
```

## Usage

Here's an example of how you can use Xpress:

```javascript
const xpress = require('xpress');

const app = new xpress();

app.get('/', (req, res) => {
    res.end('Hello World!');
})
```
