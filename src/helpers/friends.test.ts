import { getFriends } from './friends';
import { FriendsResponse } from './types';

describe('getFriends', () => {
  let originalFetch: typeof global.fetch;
  let mockSetTotalPages: jest.Mock;
  let mockUpdateProgress: jest.Mock;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    mockSetTotalPages = jest.fn();
    mockUpdateProgress = jest.fn();
    global.fetch = jest.fn();
  });

  it('should return default error object when fetch status is not 200', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 404,
    });

    const result = await getFriends('test-user', mockSetTotalPages, mockUpdateProgress);

    expect(global.fetch).toHaveBeenCalledWith('/friends?userId=test-user');
    expect(result).toEqual({
      success: false,
      pageAmount: 0,
      friends: [],
    });
    expect(mockSetTotalPages).not.toHaveBeenCalled();
    expect(mockUpdateProgress).not.toHaveBeenCalled();
  });

  it('should return default error object and call setters with 0 when body.success is false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        success: false,
      }),
    });

    const result = await getFriends('test-user', mockSetTotalPages, mockUpdateProgress);

    expect(global.fetch).toHaveBeenCalledWith('/friends?userId=test-user');
    expect(result).toEqual({
      success: false,
      pageAmount: 0,
      friends: [],
    });
    expect(mockSetTotalPages).toHaveBeenCalledWith(0);
    expect(mockUpdateProgress).toHaveBeenCalledWith(0);
  });

  it('should return friends response and call setters with body.pageAmount when body.success is true', async () => {
    const mockResponse: FriendsResponse = {
      success: true,
      pageAmount: 5,
      friends: [
        { uid: '1', username: 'Friend 1', avatar: 'avatar1.jpg', url: 'url1' },
        { uid: '2', username: 'Friend 2', avatar: 'avatar2.jpg', url: 'url2' },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getFriends('test-user', mockSetTotalPages, mockUpdateProgress);

    expect(global.fetch).toHaveBeenCalledWith('/friends?userId=test-user');
    expect(result).toEqual(mockResponse);
    expect(mockSetTotalPages).toHaveBeenCalledWith(5);
    expect(mockUpdateProgress).toHaveBeenCalledWith(5);
  });
});
