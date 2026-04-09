1. **BLOCK A: Search & Filtering Architecture**
   - **Deprecate Initial Tag Search**: Edit `src/SimpleSearch.js` to remove the `<select>` category dropdown from the search form. Add the text "Tip: Use specific terms. You can filter by tags after the results load." below the input.
   - **Post-Load Local Filtering**: Create a function `extractTags(videos)` that tokenizes titles, filters out stop words, and counts frequencies to determine the top tags in the current `results`. Render these dynamically as a dropdown/chip-list. Create state `activeLocalFilters`. Filter the results list client-side based on `activeLocalFilters`.

2. **BLOCK B: The Hyper-Gallery Grid & Layout**
   - **Asymmetric Player Layout**: Add state `activePlayerVideo`. Wrap the grid rendering in a flex container. If `activePlayerVideo` is set, render a `PlayerComponent` on the left (75% width, `position: sticky`) and the grid on the right (25% width).
   - **Hierarchical Grid Sizing**: The grid's `gridTemplateColumns` will use smaller sizes `minmax(120px, 1fr)` for Recommended items and when the layout is split (25% sidebar). It will use `minmax(250px, 1fr)` for the main Gallery/Search views.
   - **Hover Video Previews**: Enhance `VideoCard` inside `src/SimpleSearch.js`. On hover, render a `<video>` tag using the inferred preview MP4 URL (`avatar.replace(/\/[^/]+\.jpg$/, '/preview.mp4')`). Render a custom CSS `<input type="range">` on top of the video to allow scrubbing through the preview.
   - **Action Overlays**: On hover, show three buttons on the thumbnail:
     - `[Play]`: Sets `activePlayerVideo` to the video.
     - `[Download]`: Calls `/.netlify/functions/download?url=...` to get the MP4, then triggers a force download via a temporary `<a>` element.
     - `[Magic Save]`: Toggles the video in the local `selectedVideos` state.

3. **BLOCK C: The Data Engine (Pagination & Scraping)**
   - **Deprecate "Deep Scrape" Input**: Remove `pagesToScrape` state and input. Modify `handleSearch` to fetch only `page=1`.
   - **Infinite Scroll**: Add an Intersection Observer attached to a `#scroll-anchor` div at the bottom of the grid. When triggered, fetch `page + 1` and append to `results`. Prevent double fetches using an `isFetchingNextPage` lock.
   - **Metadata Extraction**: Update `functions/videos.js` to extract the "Total Results" number from `$('.headline').text()` or `$('.sort-by').text()`. Return it as `totalResults` in the JSON response. Update UI to display "Showing X of Y available videos".

4. **BLOCK D: The "Magic" Ecosystem (Smart Features)**
   - **Smart Playlist (The "Compiler")**: Add a "Compile Playlist" button in the Gallery view. When active, it sets a `compilerMode` flag. In the `PlayerComponent`, listen to `<video onEnded>` and automatically switch `activePlayerVideo` to the next video in `selectedVideos`.
   - **HyperScan / UltraScanner**: Create a utility that extracts tags from `selectedVideos` titles (ignoring stop words), calculates frequencies, and creates a "Tag Cloud" of the top 5 terms. Use these terms to automatically run background fetches (`fetch(/.netlify/functions/videos?search=...)`) to populate the `smartRecommendations` column.

5. **BLOCK E: Floating Analytics (Beta)**
   - **Telemetry Widget**: Create a `<div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>` widget.
   - Track session duration using `setInterval` since component mount.
   - Track total number of unique videos discovered using a `Set` of all fetched video URLs.
   - Display the HyperScan Tag Cloud inside this widget.

6. **BLOCK F: QA & Testing Protocol**
   - Provide pre-commit checklist verification in plan.
   - Verify cross-browser verification (Chrome vs Firefox hover).
   - Prevent infinite scroll race conditions.
   - Reset local filtering state on new search.

7. **Pre-commit Checks**
   - Run pre-commit instructions to ensure testing, verification, review, and reflection are done.
