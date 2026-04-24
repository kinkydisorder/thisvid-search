import { getVideos, parseRelativeTime, sortVideos } from './videos';
import { Video } from './types';

describe('getVideos', () => {
  let originalFetch: typeof global.fetch;
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalFetch = global.fetch;
    originalConsoleError = console.error;
  });

  afterAll(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  });

  it('should return empty array and log error when fetch fails', async () => {
    // Mock fetch to reject
    const mockError = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(mockError);

    // Mock console.error to avoid spamming the test output
    console.error = jest.fn();

    const options = {
      url: '/some-url',
      page: 1,
    };

    const result = await getVideos(options);

    expect(global.fetch).toHaveBeenCalledWith('/getVideos/', expect.objectContaining({
      method: 'POST',
      body: expect.any(String),
    }));

    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(result).toEqual([]);
  });
});

describe('parseRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-15T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should handle zero logic and empty inputs correctly', () => {
    const anchor = new Date('2023-01-15T12:00:00.000Z');

    expect(parseRelativeTime('')).toEqual(anchor);
    expect(parseRelativeTime('   ')).toEqual(anchor);
    expect(parseRelativeTime('0 seconds ago')).toEqual(anchor);
    expect(parseRelativeTime('0 days')).toEqual(anchor);
    expect(parseRelativeTime('0 weeks')).toEqual(anchor);
    expect(parseRelativeTime('0 months')).toEqual(anchor);
    expect(parseRelativeTime('0 years')).toEqual(anchor);
  });

  it('should handle keyword mappings', () => {
    const anchor = new Date('2023-01-15T12:00:00.000Z');

    expect(parseRelativeTime('today')).toEqual(anchor);
    expect(parseRelativeTime('just now')).toEqual(anchor);
    expect(parseRelativeTime('now')).toEqual(anchor);

    const yesterday = new Date(anchor);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(parseRelativeTime('yesterday')).toEqual(yesterday);
  });

  it('should handle seconds', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setSeconds(expected.getSeconds() - 30);

    expect(parseRelativeTime('30 seconds ago')).toEqual(expected);
    expect(parseRelativeTime('30 sec')).toEqual(expected);
    expect(parseRelativeTime('30 secs')).toEqual(expected);
    expect(parseRelativeTime('30 s')).toEqual(expected);
  });

  it('should handle minutes', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setMinutes(expected.getMinutes() - 15);

    expect(parseRelativeTime('15 minutes ago')).toEqual(expected);
    expect(parseRelativeTime('15 min')).toEqual(expected);
    expect(parseRelativeTime('15 mins')).toEqual(expected);
    expect(parseRelativeTime('15 m')).toEqual(expected);
  });

  it('should handle hours', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setHours(expected.getHours() - 5);

    expect(parseRelativeTime('5 hours ago')).toEqual(expected);
    expect(parseRelativeTime('5 hr')).toEqual(expected);
    expect(parseRelativeTime('5 hrs')).toEqual(expected);
    expect(parseRelativeTime('5 h')).toEqual(expected);
  });

  it('should handle days', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setDate(expected.getDate() - 3);

    expect(parseRelativeTime('3 days ago')).toEqual(expected);
    expect(parseRelativeTime('3 day')).toEqual(expected);
  });

  it('should handle weeks', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setDate(expected.getDate() - 14);

    expect(parseRelativeTime('2 weeks ago')).toEqual(expected);
    expect(parseRelativeTime('2 week')).toEqual(expected);
  });

  it('should handle months', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setMonth(expected.getMonth() - 2);

    expect(parseRelativeTime('2 months ago')).toEqual(expected);
    expect(parseRelativeTime('2 month')).toEqual(expected);
  });

  it('should handle years', () => {
    const expected = new Date('2023-01-15T12:00:00.000Z');
    expected.setFullYear(expected.getFullYear() - 1);

    expect(parseRelativeTime('1 year ago')).toEqual(expected);
    expect(parseRelativeTime('1 years')).toEqual(expected);
  });

  it('should handle unknown formats', () => {
    const anchor = new Date('2023-01-15T12:00:00.000Z');

    expect(parseRelativeTime('xyz')).toEqual(anchor);
    expect(parseRelativeTime('5 blablas')).toEqual(anchor);
  });
});


describe('sortVideos', () => {
  const createMockVideo = (overrides: Partial<Video>): Video => ({
    title: 'Test',
    url: '/test',
    isPrivate: false,
    duration: '00:00',
    avatar: 'avatar.jpg',
    views: 0,
    date: 'today',
    relevance: 0,
    page: 1,
    ...overrides,
  });

  const baseDate = new Date('2023-01-15T12:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(baseDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should handle undefined and empty array', () => {
    expect(sortVideos(undefined, 'newest')).toEqual([]);
    expect(sortVideos([], 'newest')).toEqual([]);
  });

  it('should not mutate the original array', () => {
    const arr = [createMockVideo({ title: 'A' }), createMockVideo({ title: 'B' })];
    const clone = [...arr];
    sortVideos(arr, 'views');
    expect(arr).toEqual(clone);
  });

  it('should sort by newest (date descending) with views fallback', () => {
    const v1 = createMockVideo({ date: '2 days ago', views: 100 }); // newer
    const v2 = createMockVideo({ date: '5 days ago', views: 500 }); // older
    const v3 = createMockVideo({ date: '5 days ago', views: 1000 }); // older but more views

    const result = sortVideos([v2, v1, v3], 'newest');
    expect(result).toEqual([v1, v3, v2]);
  });

  it('should sort by oldest (date ascending) with views fallback', () => {
    const v1 = createMockVideo({ date: '5 days ago', views: 1000 }); // older, more views
    const v2 = createMockVideo({ date: '5 days ago', views: 500 }); // older
    const v3 = createMockVideo({ date: '2 days ago', views: 100 }); // newer

    const result = sortVideos([v3, v2, v1], 'oldest');
    expect(result).toEqual([v1, v2, v3]);
  });

  it('should sort by longest (duration descending)', () => {
    const v1 = createMockVideo({ duration: '12:30' });
    const v2 = createMockVideo({ duration: '5:00' });
    const v3 = createMockVideo({ duration: '45:15' });

    const result = sortVideos([v1, v2, v3], 'longest');
    expect(result).toEqual([v3, v1, v2]);
  });

  it('should sort by shortest (duration ascending)', () => {
    const v1 = createMockVideo({ duration: '12:30' });
    const v2 = createMockVideo({ duration: '5:00' });
    const v3 = createMockVideo({ duration: '45:15' });

    const result = sortVideos([v1, v3, v2], 'shortest');
    expect(result).toEqual([v2, v1, v3]);
  });

  it('should sort by views descending', () => {
    const v1 = createMockVideo({ views: 500 });
    const v2 = createMockVideo({ views: 10 });
    const v3 = createMockVideo({ views: 1000 });

    const result = sortVideos([v1, v2, v3], 'views');
    expect(result).toEqual([v3, v1, v2]);
  });

  it('should sort by viewsAsc ascending', () => {
    const v1 = createMockVideo({ views: 500 });
    const v2 = createMockVideo({ views: 10 });
    const v3 = createMockVideo({ views: 1000 });

    const result = sortVideos([v1, v3, v2], 'viewsAsc');
    expect(result).toEqual([v2, v1, v3]);
  });

  it('should sort by relevance descending with views fallback', () => {
    const v1 = createMockVideo({ relevance: 10, views: 100 });
    const v2 = createMockVideo({ relevance: 5, views: 500 });
    const v3 = createMockVideo({ relevance: 5, views: 1000 }); // same relevance, more views

    const result = sortVideos([v2, v1, v3], 'relevance');
    expect(result).toEqual([v1, v3, v2]);
  });

  it('should default to newest sort when passing invalid sortMode', () => {
    const v1 = createMockVideo({ date: '2 days ago', views: 100 });
    const v2 = createMockVideo({ date: '5 days ago', views: 500 });
    const v3 = createMockVideo({ date: '5 days ago', views: 1000 });

    // Should behave exactly like 'newest'
    const result = sortVideos([v2, v1, v3], 'invalid_mode' as any);
    expect(result).toEqual([v1, v3, v2]);
  });
});
