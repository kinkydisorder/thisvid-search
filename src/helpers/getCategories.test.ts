import { getCategories } from './getCategories';

describe('getCategories', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
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
              </a>
            </div>
          </div>
          <div id="tab2">
            <div class="thumbs-categories">
              <a href="https://thisvid.com/categories/gay-anal/">
                <img src="//cdn.thisvid.com/categories/gay-anal.jpg" />
                <span class="title">gay anal</span>
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockHtml),
    });

    const categories = await getCategories();

    expect(global.fetch).toHaveBeenCalledWith('/categories/');
    expect(categories).toHaveLength(3);

    expect(categories[0]).toEqual({
      name: 'Anal Play',
      image: 'https://cdn.thisvid.com/categories/anal.jpg',
      slug: 'anal-play',
      orientation: 'straight',
    });

    expect(categories[1]).toEqual({
      name: 'Bdsm',
      image: 'https://cdn.thisvid.com/categories/bdsm.jpg',
      slug: 'bdsm',
      orientation: 'straight',
    });

    expect(categories[2]).toEqual({
      name: 'Gay Anal',
      image: 'https://cdn.thisvid.com/categories/gay-anal.jpg',
      slug: 'gay-anal',
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

    await expect(getCategories()).rejects.toThrow('Network error');
  });
});
