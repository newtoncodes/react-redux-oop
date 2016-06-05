# react-redux-oop

OOP implementation of redux and react.

## Motivation

Functional programming is very popular right now among web and mobile frontend developers. It's a cool way of doing things but in my opinion it's never black and white. It's a good paradigm and developers can learn a hell lot out of it but I personally don't like they apps are being organized. I just like many developers don't like plain functions in hundreds lowercase files. I like the class structure, because it eases reading and understanding the code a lot. I believe this implementation of redux and react can be helpful for bigger applications.

## Installation

`npm install --save react-redux-oop`

The project defaults to ES6, so if you don't use Babel you will have to import react-redux-oop/es5 directory.
The UMD build is in the dist directory.

## Description

This is just an implementation of react and redux. It uses plain `react`, `redux` and `react-redux`.  No functionality is changed or added to these libraries. It's only a way to organize your app with a bunch of helpful classes. Also it solves the problem with multiple stores and binded action creators.

#### Store

This is a wrapper of the redux store. It's purpose is to be able to easily enable and disable reducers without too much function composition. Also **splits reducers by actions and store path**, instead of just store path. The store requires the usage of [seamless-immutable](https://github.com/rtfeldman/seamless-immutable). It will automatically force it onto your state objects. It also extends [eventemitter3](https://github.com/primus/eventemitter3).

```typescript
class Store extends EventEmitter {
    constructor(state: Object, enhancer: function) {}
    
    addReducer(action: string, path: string, reducer: function) {}
    removeReducer(action: string, path: string, reducer: function) {}
    addReducers(reducers: Object) {}
    removeReducers(reducers: Object) {}
    
    get state(): Object {}
    get reduxStore(): Object {}
}
```

##### Reducers

Reducers in the Store are added either as a single reducer or as an object of this format:

```javascript
store.addReducers({
    'ADD_ITEM': {
        'todo': [
            (state = {lastId: 0, items: {}}, action) => {
                // Do the job
            },
            (state = {lastId: 0, items: {}}, action) => {
                // Another reducer for the same action and state.
            }
        ]
    },

    'REMOVE_ITEM': {
        'todo.items': [
            (state = {}, action) => {
                // Do the job
            }
        ]
    },

    // or you can use wildcards '*' meaning all actions or the full state:
    '*': {
        '*': [
            (state = {}, action) => {
                // Do the job
            }
        ]
    }
});
```

#### Controller

This "abstract" class is used to remove the need of action creators. **It combines dispatching with creating the action**. Every controller is provided with the store's dispatch. It also works on the server, because you can create multiple controllers with different stores. Action creators cannot be binded to the dispatch, because the store changes on the server and they are just functions, but controllers can, because they have context.

```typescript
class Controller {
    constructor(dispatch: function) {}
    
    provideDispatch(dispatch: function) {}
    dispatch(type: string, data: Object = {}) {}
}
```

#### Container

This is an "abstract" extension to the React.Component class. It uses react-redux to connect to the store but used a different syntax and flow to utilize the dispatch method. Every Container component can set an `actions` object of Controllers which are automatically provided with the store from react-redux'es Provider. **Containers are always treated as pure**.

```typescript
class Container extends React.Component {
    static connect() {}
    constructor(props: Object) {}
    dispatch(type: string, data: Object) {}
}
```

#### App

```typescript
class App {
    constructor(state: Object = {}, middlewares: Array.<function> = [], enhancers: Array.<function> = []) {}
    
    configure(state: Object = {}) {}
    renderTo(node: HTMLElement) {}
    renderHtml() {}
    renderStaticHtml() {}
    
    _addMiddleware(middleware, index = null) {}
    _addEnhancer(enhancer: function, index: number = null) {}
    _createStore(state:Object = {}) {}
    _render() {}
    
    get store(): Store {}
}
```

An "abstract" facade class for your application. It's supposed to be extended with custom functionality. It only has a **bootstrapping function** and **may not be used at all** if you don't like it.


## Example

There is a todo example in the example directory. It shows the full usage. Here is the basic idea:

```javascript
class TodoController extends Controller {
    addTodo(text) {
        this.dispatch('ADD_TODO', {text});
    }
    
    removeTodo() {
        this.dispatch('ADD_TODO', {text});
    }
    
    asyncAction() {
        this.dispatch('ASYNC_START');
        setTimeout(() => this.dispatch('ASYNC_COMPLETE'), 1000);
    }
}

const TodoReducers = {
    'ADD_TODO': {
        'todo': [
            (state = {lastId: 0, items: {}}, action) => {
                let newId = state.lastId + 1;

                return {
                    lastId: newId,
                    items: state.items.merge({
                        [newId]: {text: action.text, checked: false}
                    })
                }
            }
        ]
    },

    'REMOVE_TODO': {
        'todo.items': [
            (state = {}, action) => state.without(action.id)
        ]
    }
}

class TodoContainer extends Container {
    // This is mapStateToProps from react-redux
    static mapper(state) {
        return {
            items: state.todo.items
        };
    }

    // Actions can be defined this way:
    actions = {
        todo: new TodoController(),
        another: new AnotherConroller();
    }
    
    // or this way:
    actions = new TodoController();

    render() {
        return (
            <TodoList
                items={this.props.items}
                onAdd={text => this.actions.addTodo(text)}
                onRemove={id => this.actions.removeTodo(id)}
            />
        );
    }
}

TodoContainer = TodoContainer.connect();


class ExampleApp extends App {
    constructor() {
        super({
            todo: {
                lastId: 0,
                items: {}
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            this._addMiddleware(require('redux-logger')());

            let matches = window.location.href.match(/[?&]_debug=([^&]+)\b/);
            let session = (matches && matches.length) ? matches[1] : null;

            let devTools = null;
            if (window['devToolsExtension']) devTools = window['devToolsExtension']();

            if (devTools) this._addEnhancer(devTools);
        }
    }

    _render() {
        return (
            <div>
                <TodoContainer />
            </div>
        );
    };

    _createStore() {
        let store = super._createStore();
        store.addReducers(TodoReducers);
        return store;
    }
}


// Create an app and append it to the DOM

const app = new ExampleApp();

app
  .configure({/* Change initial state, maybe from server or something. */})
  .renderTo(document.getElementById('app'));

// We can just create a controller and execute new actions.

let controller = new TodoController(app.store.dispatch);
controller.addItem('Have something to eat.');
controller.addItem('Have something to drink.');
controller.addItem('Sleep.');
```