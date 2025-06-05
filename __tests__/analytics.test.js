jest.mock('axios', () => ({ post: jest.fn() }), { virtual: true });
jest.mock('sentiment', () => (
  jest.fn().mockImplementation(() => ({ analyze: () => ({ comparative: 0.5 }) }))
), { virtual: true });

const axios = require('axios');
const { regAuthor, contentAnalys } = require('../crawler/analytics');

describe('analytics utilities', () => {
  test('regAuthor cleans author name', () => {
    expect(regAuthor('John\nDoe\t')).toBe('JohnDoe');
    expect(regAuthor('Anonymous')).toBe('Anonymous');
    expect(regAuthor('')).toBe('Anonymous');
  });

  test('contentAnalys returns sentiment and entities', async () => {
    axios.post.mockResolvedValue({ data: ['Entity'] });
    const res = await contentAnalys('Good content');
    expect(res).toEqual({ score: 0.5, entities: ['Entity'] });
  });
});
