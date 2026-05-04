import getDownloadUrl from './getDownloadUrl';

describe('getDownloadUrl', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should return videoUrl when fetch is successful', async () => {
    const mockVideoUrl = 'https://example.com/video.mp4';
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ videoUrl: mockVideoUrl }),
    });

    const result = await getDownloadUrl('https://thisvid.com/video1/');

    expect(global.fetch).toHaveBeenCalledWith('/download?url=https://thisvid.com/video1/');
    expect(result).toBe(mockVideoUrl);
  });

  it('should return empty string when videoUrl is missing in response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await getDownloadUrl('https://thisvid.com/video1/');

    expect(result).toBe('');
  });

  it('should return false when response status is not 200', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 404,
    });

    const result = await getDownloadUrl('https://thisvid.com/video1/');

    expect(result).toBe(false);
  });

  it('should throw error when fetch fails', async () => {
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    await expect(getDownloadUrl('https://thisvid.com/video1/')).rejects.toThrow('Network error');
  });
});
