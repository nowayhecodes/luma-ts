[luma-ts - v1.0.0](../README.md) / single-dispatch

# Module: single-dispatch

### Table of contents

### singledispatch

A method decorator that enables function overloading based on the type passed to @register().
Similar to Python's functools.singledispatch, it allows registering different implementations
for different argument types.

The decorated method becomes the default handler for unregistered types, and gains a `register`
method that can be used to register handlers for specific types.

### Returns

The `register` method that can be used to register handlers for specific types, providing the ability to
add method overloads for different types.

### Motivation

In TypeScript ecosystems, it is not possible to overload a function/method based on the type of the argument.
If you try, you will get a `Duplicate function implementation` error.
This is because, when both functions are compiled to JavaScript, their signature is totally identical. 

This is a problem when you need to handle different types of arguments in a single function.

So, this decorator is a way to achieve function overloading based on the type of the argument, as exemplified below.

### Example

```ts
class Example {
  static handler: { register: (type: string | Function) => MethodDecorator };

  @Example.handler.register(Number)
  handler(arg: any): string {
    return `Default handler: ${arg}`;
  }

  @Example.handler.register("number")
  private _number(x: number): string {
    return `Number handler: ${x * 2}`;
  }

  @Example.handler.register("string")
  private _string(x: string): string {
    return `String handler: ${x.toUpperCase()}`;
  }
}

const example = new Example();
example.handler(42);      // "Number handler: 84"
example.handler("test"); // "String handler: TEST"
example.handler(true);   // "Default handler: true"
```
