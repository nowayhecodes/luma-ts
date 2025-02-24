[luma-ts - v1.0.0](../README.md) / single-dispatch

# Module: single-dispatch

## Table of contents

### Functions

- [singledispatch](single_dispatch.md#singledispatch)

## Functions

### singledispatch

▸ **singledispatch**(`target`, `propertyKey`, `descriptor`): `PropertyDescriptor`

A method decorator that enables function overloading based on the type passed to @register().
Similar to Python's functools.singledispatch, it allows registering different implementations
for different argument types.

The decorated method becomes the default handler for unregistered types, and gains a `register`
method that can be used to register handlers for specific types.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `any` | The target object (prototype) |
| `propertyKey` | `string` \| `symbol` | The name of the decorated method |
| `descriptor` | `PropertyDescriptor` | The property descriptor of the decorated method |

#### Returns

`PropertyDescriptor`

A modified property descriptor that includes the dispatch logic

**`Example`**

```ts
class Example {
  static handler: { register: (type: string | Function) => MethodDecorator };
```

**`Singledispatch`**

handler(arg: any): string {
    return `Default handler: ${arg}`;
  }

  @Example.handler.register(Number)
  private handleNumber(x: number): string {
    return `Number handler: ${x * 2}`;
  }

  @Example.handler.register("string")
  private handleString(x: string): string {
    return `String handler: ${x.toUpperCase()}`;
  }
}

const example = new Example();
example.handler(42);      // "Number handler: 84"
example.handler("test"); // "String handler: TEST"
example.handler(true);   // "Default handler: true"

#### Defined in

single-dispatch.ts:50
