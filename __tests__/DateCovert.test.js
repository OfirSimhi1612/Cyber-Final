const dateParser = require('../crawler/helpers/DateCovert');

describe('dateParser', () => {
  test('parses absolute date string', () => {
    const ts = dateParser('January 1, 2020');
    expect(ts).toBe(new Date('January 1, 2020').getTime());
  });

  test('parses relative date words', () => {
    const spy = jest.spyOn(Date, 'now').mockReturnValue(1600000000000);
    const ts = dateParser('2 days');
    expect(ts).toBe(1600000000000 - 2 * 24 * 60 * 60 * 1000);
    spy.mockRestore();
  });
});
