const mockCount = jest.fn();
const mockSearch = jest.fn();

jest.mock('@elastic/elasticsearch', () => (
  { Client: jest.fn(() => ({ count: mockCount, search: mockSearch })) }
), { virtual: true });

const compare = require('../server/elastic-search/compare');

describe('compare', () => {
  beforeEach(() => {
    mockCount.mockReset();
    mockSearch.mockReset();
  });

  test('returns new posts when index has older posts', async () => {
    mockCount.mockResolvedValue({ body: { count: 2 } });
    mockSearch.mockResolvedValue({ body: { hits: { hits: [
      { _source: { date: '2020-01-01' } },
      { _source: { date: '2020-01-02' } }
    ] } } });
    const posts = [
      { date: '2020-01-01' },
      { date: '2020-01-03' }
    ];
    const res = await compare(posts);
    expect(res).toEqual([{ date: '2020-01-03' }]);
  });

  test('returns posts when index empty', async () => {
    mockCount.mockResolvedValue({ body: { count: 0 } });
    const posts = [{ date: '2020-01-03' }];
    const res = await compare(posts);
    expect(res).toEqual(posts);
  });
});
