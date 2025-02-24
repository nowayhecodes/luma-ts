import "reflect-metadata";

type HandlerFunction = (...args: any[]) => any;

interface DispatchFunction extends Function {
  (...args: any[]): any;
  register(type: string | Function): MethodDecorator;
}

const REGISTRY = Symbol("registry");

/**
 * A method decorator that enables function overloading based on the type passed to @register().
 * Similar to Python's functools.singledispatch, it allows registering different implementations
 * for different argument types.
 *
 * The decorated method becomes the default handler for unregistered types, and gains a `register`
 * method that can be used to register handlers for specific types.
 *
 * @returns The `register` method that can be used to register handlers for specific types, providing the ability to
 * add method overloads for different types.
 *
 * @example
 * class Example {
 *   static handler: { register: (type: string | Function) => MethodDecorator };
 *
 *   @singledispatch
 *   handler(arg: any): string {
 *     return `Default handler: ${arg}`;
 *   }
 *
 *   @Example.handler.register(Number)
 *   private handleNumber(x: number): string {
 *     return `Number handler: ${x * 2}`;
 *   }
 *
 *   @Example.handler.register("string")
 *   private handleString(x: string): string {
 *     return `String handler: ${x.toUpperCase()}`;
 *   }
 * }
 *
 * const example = new Example();
 * example.handler(42);      // "Number handler: 84"
 * example.handler("test"); // "String handler: TEST"
 * example.handler(true);   // "Default handler: true"
 */
export function singledispatch(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  if (!target.constructor[REGISTRY]) {
    target.constructor[REGISTRY] = new Map<string, HandlerFunction>();
  }

  function createRegisterDecorator(type: string | Function): MethodDecorator {
    return (
      _target: any,
      _propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const typeStr =
        typeof type === "function" ? type.name.toLowerCase() : type;
      target.constructor[REGISTRY].set(typeStr, descriptor.value);
      return descriptor;
    };
  }

  function dispatchFunction(this: any, ...args: any[]) {
    const [firstArg] = args;
    const type = typeof firstArg;
    const handler = target.constructor[REGISTRY].get(type) || defaultHandler;
    return handler.apply(this, args);
  }

  const defaultHandler: HandlerFunction = (...args: any[]) => {
    return originalMethod.apply(target, args);
  };

  const dispatch = dispatchFunction as DispatchFunction;
  dispatch.register = createRegisterDecorator;

  target.constructor[propertyKey] = { register: createRegisterDecorator };
  descriptor.value = dispatch;
  return descriptor;
}
