const { get, set } = require('./../src/memoryCacheAdapter');

describe('when using memory cache adapter', () => {
  it('then it should return same value that was set when value is a string', async () => {
    await set('test1', 'some-value');

    const actual = await get('test1');

    expect(actual).toBe('some-value');
  });

  it('then it should return same value that was set when value is a number', async () => {
    await set('test2', 2);

    const actual = await get('test2');

    expect(actual).toBe(2);
  });

  it('then it should return same value that was set when value is an object', async () => {
    await set('test3', {
      s: 'string',
      n: 1,
      b: true,
    });

    const actual = await get('test3');

    expect(actual).toEqual({
      s: 'string',
      n: 1,
      b: true,
    });
  });

  it('then it should return null if no value previosly set', async () => {
    const actual = await get('test4');

    expect(actual).toBeNull();
  });

  it('then it should return null if no value has timed out', async () => {
    await set('test5', 'some-value', 100);
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    const actual = await get('test5');

    expect(actual).toBeNull();
  });
});
