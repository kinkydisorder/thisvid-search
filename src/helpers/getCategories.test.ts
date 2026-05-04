import { getCategories } from './getCategories';

describe('getCategories', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
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
              <a href="https://thisvid.com/categories/anal-play/">
                <img src="//cdn.thisvid.com/categories/anal.jpg" />
                <span class="title">anal play</span>
              </a>
              <a href="/categories/bdsm/">
                <img src="//cdn.thisvid.com/categories/bdsm.jpg" />
                <span class="title">bdsm</span>
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
              <a href="https://thisvid.com/categories/gay-anal/">
                <img src="//cdn.thisvid.com/categories/gay-anal.jpg" />
                <span class="title">gay anal</span>
              <a href="/category/gay-cat-1/">
                <span class="title">gay cat one</span>
                <img src="//example.com/gay1.jpg" />
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockHtml),
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce(mockHtml),
    });

    const categories = await getCategories();

    expect(global.fetch).toHaveBeenCalledWith('/categories/');
    expect(categories).toHaveLength(3);

    expect(categories[0]).toEqual({
      name: 'Anal Play',
      image: 'https://cdn.thisvid.com/categories/anal.jpg',
      slug: 'anal-play',
      name: 'Straight Cat One',
      image: 'https://example.com/straight1.jpg',
      slug: 'straight-cat-1',
      orientation: 'straight',
    });

    expect(categories[1]).toEqual({
      name: 'Bdsm',
      image: 'https://cdn.thisvid.com/categories/bdsm.jpg',
      slug: 'bdsm',
      name: 'Another Cat',
      image: 'https://example.com/straight2.jpg',
      slug: 'straight-cat-2',
      orientation: 'straight',
    });

    expect(categories[2]).toEqual({
      name: 'Gay Anal',
      image: 'https://cdn.thisvid.com/categories/gay-anal.jpg',
      slug: 'gay-anal',
      name: 'Gay Cat One',
      image: 'https://example.com/gay1.jpg',
      slug: 'gay-cat-1',
      orientation: 'gay',
    });
  });

  it('should handle missing attributes gracefully', async () => {
    const mockHtml = `
      <div id="tab1">
        <div class="thumbs-categories">
          <a>
            <span class="title"></span>
          </a>
          <a href="">
            <img />
            <span class="title">singleword</span>
          </a>
        </div>
      </div>
    `;

    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockHtml),
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
      name: 'Singleword',
      image: '',
      slug: '',
      orientation: 'straight',
    });
  });

  it('should throw an error if fetch fails', async () => {
    const mockError = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(mockError);
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
