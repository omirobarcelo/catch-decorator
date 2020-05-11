import { Catch, CatchAll } from '../src';

describe('catch-decorator', () => {
  let handler;

  beforeEach(() => {
    handler = jest.fn();
  });

  it('calls handler with error object and context object arguments', () => {
    class TestClass {
      @Catch(ReferenceError, handler)
      testMethod() {
        throw new ReferenceError('Error here');

        return 'Test';
      }
    }
    new TestClass().testMethod();

    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });

  it('handles errors in async methods with Promise.reject', async () => {
    class TestClass {
      @Catch(ReferenceError, handler)
      async testMethod() {
        await Promise.reject(new ReferenceError('Error here'));

        return 'Test';
      }
    }
    await new TestClass().testMethod();

    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });

  it('handles errors in async methods with throw error', async () => {
    class TestClass {
      @Catch(ReferenceError, handler)
      async testMethod() {
        throw new ReferenceError('Error here');

        return 'Test';
      }
    }
    await new TestClass().testMethod();

    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });

  it('handles correct error with chained decorators', async () => {
    class TestClass {
      @Catch(ReferenceError, handler)
      @Catch(TypeError, handler)
      testMethod() {
        throw new TypeError('Error here');
        throw new ReferenceError('Error here');

        return 'Test';
      }
    }
    new TestClass().testMethod();

    expect(handler).toBeCalledWith(expect.any(TypeError), expect.any(TestClass));
  });

  it('calls CatchAll handler with any error', () => {
    class TestClass {
      @CatchAll(handler)
      testMethod() {
        throw new ReferenceError('Error here');

        return 'Test';
      }
    }
    new TestClass().testMethod();

    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });

  it('runs CatchAll handler if specific handler not registered', () => {
    const catchAllHandler = jest.fn();

    class TestClass {
      @CatchAll(catchAllHandler)
      @Catch(TypeError, handler)
      testMethod() {
        throw new ReferenceError('Error here');

        return 'Test';
      }
    }
    new TestClass().testMethod();

    expect(catchAllHandler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });

  it('handles errors in static methods', () => {
    class TestClass {
      @Catch(ReferenceError, handler)
      static testMethod() {
        throw new ReferenceError('Error here');
        console.log('Test');
      }
    }
    TestClass.testMethod();

    expect(handler).toBeCalledWith(expect.any(ReferenceError), TestClass);
  });

  it('handles errors when decorating the class', () => {
    @Catch(ReferenceError, handler)
    class TestClass {
      testMethod1() {
        throw new ReferenceError('Error here');
        console.log('Test');
      }

      testMethod2() {
        throw new ReferenceError('Error here');
        console.log('Test');
      }
    }
    const testClass = new TestClass();

    testClass.testMethod1();
    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));

    testClass.testMethod2();
    expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass));
  });
});
