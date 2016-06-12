'use strict';

// Create an app and append it to the DOM

const ExampleApp = require('./ExampleApp');
const app = new ExampleApp();

app.configure().renderTo(document.getElementById('app'));


// We can just create a controller and execute new actions.

const TodoController = require('./todo/TodoController');
let controller = new TodoController(app.store);
controller.addItem('Have something to eat.');
controller.addItem('Have something to drink.');
controller.addItem('Sleep.');
