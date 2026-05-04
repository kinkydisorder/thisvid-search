import { getUsername, getNameWithSeed } from './users';

describe('getUsername', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should return null if id is empty', async () => {
    const result = await getUsername('');
    expect(result).toBeNull();
  });

  it('should return null if user is not found (404)', async () => {
    fetchSpy.mockResolvedValue({
      status: 404,
    } as Response);

    const result = await getUsername('nonexistent');
    expect(result).toBeNull();
    expect(fetchSpy).toHaveBeenCalledWith('/members/nonexistent/');
  });

  it('should extract username from profile page', async () => {
    const mockHtml = `
      <div class="profile-menu">
        <div class="headline">
          <h2>JohnDoe</h2>
        </div>
      </div>
    `;
    fetchSpy.mockResolvedValue({
      status: 200,
      text: () => Promise.resolve(mockHtml),
    } as Response);

    const result = await getUsername('123');
    expect(result).toBe('JohnDoe');
    expect(fetchSpy).toHaveBeenCalledWith('/members/123/');
  });

  it('should return "username not found" if selector does not match', async () => {
    const mockHtml = `<div>No profile here</div>`;
    fetchSpy.mockResolvedValue({
      status: 200,
      text: () => Promise.resolve(mockHtml),
    } as Response);

    const result = await getUsername('456');
    expect(result).toBe('username not found');
  });
});

describe('getNameWithSeed', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should return the first "Mr" name from randomuser.me API', async () => {
    const mockApiResponse = {
      results: [
        { name: { title: 'Ms', first: 'Jane', last: 'Doe' } },
        { name: { title: 'Mr', first: 'John', last: 'Smith' } },
        { name: { title: 'Mr', first: 'Bob', last: 'Jones' } },
      ],
    };

    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await getNameWithSeed('some-visitor-id');
    expect(result).toBe('John Smith');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('seed=some-visitor-id')
    );
  });

  it('should return visitorId if no "Mr" is found', async () => {
    const mockApiResponse = {
      results: [
        { name: { title: 'Ms', first: 'Jane', last: 'Doe' } },
      ],
    };

    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve(mockApiResponse),
    } as Response);

    const result = await getNameWithSeed('visitor-123');
    expect(result).toBe('visitor-123');
  });
});
