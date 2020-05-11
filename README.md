# Catch Decorator
ECMAScript/TypeScript Catch decorator for classes and functions. Based on [@enkot/catch-decorator](https://github.com/enkot/catch-decorator).

## Install
```
npm install @magna_shogun/catch-decorator

yarn add @magna_shogun/catch-decorator
```

## Usage
> `catch-decorator` works with any ECMAScript/TypeScript class. If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed. If you use TypeScript, enable `--experimentalDecorators` flag.

#### Catch
Decorate a function to catch the specific type of error.  
```
class Messenger {
  @Catch(ReferenceError, (err, ctx) => {...})
  getMessages() {
    throw new ReferenceError('ReferenceError here!');
    ...
  }
}
```

You can stack decorators to catch and handle different types of error.  
```
class Messenger {
  @Catch(TypeError, (err, ctx) => {...})
  @Catch(ReferenceError, (err, ctx) => {...})
  getMessages() {
    if (conditionA) {
      throw new ReferenceError('ReferenceError here!');
      ...
    }
    if (conditionB) {
      throw new TypeError('TypeError here!');
      ...
    }   
  }
}
```

It also works for `async` functions.  
```
class Messenger {
  @Catch(ServerError, (err, ctx) => {...})
  async getMessages() {
    return fetch(myRequest).then(response => { // can throw ServerError
      ...
    });
  }
}
```

#### CatchAll
You can catch any type of errors using the `CatchAll` decorator.
```
class Messenger {
  @CatchAll((err, ctx) => {...})
  getMessages() {
    // Both ReferenceError and TypeError will be catched
    if (conditionA) {
      throw new ReferenceError('ReferenceError here!');
      ...
    }
    if (conditionB) {
      throw new TypeError('TypeError here!');
      ...
    }   
  }
}
```

#### Class Decoration
If you want to apply the same decorator to all the functions of a class (excluding its constructor), you can add the decorator to the class.  
```
class Messenger {
  @Catch(ReferenceError, (err, ctx) => {...})
  getMessages() {
    throw new ReferenceError('ReferenceError here!');
    ...
  }
  
  @Catch(ReferenceError, (err, ctx) => {...})
  getPosts() {
    throw new ReferenceError('ReferenceError here!');
    ...
  }
}
```

This can be re-written as follows.  
```
@Catch(ReferenceError, (err, ctx) => {...})
class Messenger {
  getMessages() {
    throw new ReferenceError('ReferenceError here!');
    ...
  }
  
  getPosts() {
    throw new ReferenceError('ReferenceError here!');
    ...
  }
}
```

#### HandlerFunction
The callback for the `Catch` and `CatchAll` decorators is of type `HandlerFunction`.  
```
type HandlerFunction = (error: Error, ctx: any) => void;
```

`error` is the caught error or exception.  
`ctx` is the context (`this`) of the function were the error was thrown.

## License
MIT
