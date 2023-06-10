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
    res.send('Hello World!');
})
```
---
## Route Methods

Xpress provides several route methods that allow you to define handlers for different HTTP methods. Here are the available route methods:

### `app.get(path, handler)`

The `get()` method is used to define a route handler for GET requests.

**Usage Example:**

```javascript
app.get('/', (req, res) => {
    // Handler logic for GET '/'
});
```

### `app.post(path, handler)`

The `post()` method is used to define a route handler for POST requests.

**Usage Example:**

```javascript
app.post('/users', (req, res) => {
    // Handler logic for POST '/'
});
```

### `app.put(path, handler)`

The `put()` method is used to define a route handler for PUT requests.

**Usage Example:**

```javascript
app.put('/users/:id', (req, res) => {
    // Handler logic for PUT '/users/:id'
});
```

### `app.delete(path, handler)`

The `delete()` method is used to define a route handler for DELETE requests.

**Usage Example:**

```javascript
app.delete('/users/:id', (req, res) => {
    // Handler logic for DELETE '/users/:id'
});
```

### `app.all(path, handler)`

The `all()` method is used to define a route handler for all HTTP methods.

**Usage Example:**

```javascript
app.all('/users', (req, res) => {
    // Handler logic for all methods '/users'
});
```