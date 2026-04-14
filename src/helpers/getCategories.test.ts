import { getCategories } from './getCategories';

describe('getCategories', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch and parse straight and gay categories correctly', async () => {
    const mockHtml = `
      <html>
        <body>
          <div id="tab1">
            <div class="thumbs-categories">
              <a href="/category/straight-cat-1/">
                <span class="title">straight cat one</span>
                <img src="//example.com/straight1.jpg" />
              </a>
              <a href="/category/straight-cat-2/">
                <span class="title">another cat</span>
                <img src="https://example.com/straight2.jpg" />
              </a>
            </div>
          </div>
          <div id="tab2">
            <div class="thumbs-categories">
              <a href="/category/gay-cat-1/">
                <span class="title">gay cat one</span>
                <img src="//example.com/gay1.jpg" />
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockHtml),
    });

    const categories = await getCategories();

    expect(global.fetch).toHaveBeenCalledWith('/categories/');
    expect(categories).toHaveLength(3);

    expect(categories[0]).toEqual({
      name: 'Straight Cat One',
      image: 'https://example.com/straight1.jpg',
      slug: 'straight-cat-1',
      orientation: 'straight',
    });

    expect(categories[1]).toEqual({
      name: 'Another Cat',
      image: 'https://example.com/straight2.jpg',
      slug: 'straight-cat-2',
      orientation: 'straight',
    });

    expect(categories[2]).toEqual({
      name: 'Gay Cat One',
      image: 'https://example.com/gay1.jpg',
      slug: 'gay-cat-1',
      orientation: 'gay',
    });
  });

  it('should handle missing attributes gracefully', async () => {
    const mockHtml = `
      <html>
        <body>
          <div id="tab1">
            <div class="thumbs-categories">
              <a>
                <span class="title"></span>
                <img />
              </a>
            </div>
          </div>
          <div id="tab2">
            <div class="thumbs-categories">
              <a>
                <!-- Missing span and img entirely -->
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockHtml),
    });

    const categories = await getCategories();

    expect(categories).toHaveLength(2);

    expect(categories[0]).toEqual({
      name: '',
      image: '',
      slug: '',
      orientation: 'straight',
    });

    expect(categories[1]).toEqual({
      name: '',
      image: '',
      slug: '',
      orientation: 'gay',
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(getCategories()).rejects.toThrow('Network error');
  });
});
