const mockCount = jest.fn();
const mockSearch = jest.fn();

jest.mock('@elastic/elasticsearch', () => (
  { Client: jest.fn(() => ({ count: mockCount, search: mockSearch })) }
), { virtual: true });

const { searchPosts, getLatest } = require('../server/elastic-search');

describe('elastic search functions', () => {
  beforeEach(() => {
    mockCount.mockReset();
    mockSearch.mockReset();
  });

  test('searchPosts returns mapped hits', async () => {
    mockCount.mockResolvedValue({ body: { count: 1 } });
    mockSearch.mockResolvedValue({ body: { hits: { hits: [{ _source: { a: 1 } }] } } });
    const res = await searchPosts('query');
    expect(mockCount).toHaveBeenCalled();
    expect(mockSearch).toHaveBeenCalled();
    expect(res).toEqual([{ a: 1 }]);
  });

  test('getLatest returns mapped hits', async () => {
    mockSearch.mockResolvedValue({ body: { hits: { hits: [{ _source: { b: 2 } }] } } });
    const res = await getLatest();
    expect(mockSearch).toHaveBeenCalled();
    expect(res).toEqual([{ b: 2 }]);
  });
});
