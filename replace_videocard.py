import sys

def replace_in_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    old_videocard = """  const VideoCard = ({ video, isSelected }) => {
    const [hoverIndex, setHoverIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const thumbs = getHoverThumbnails(video.avatar);

    useEffect(() => {
      let interval;
      if (isHovering && thumbs.length > 1) {
        interval = setInterval(() => {
          setHoverIndex(prev => (prev + 1) % thumbs.length);
        }, 800);
      } else {
        setHoverIndex(0);
      }
      return () => clearInterval(interval);
    }, [isHovering, thumbs.length]);

    return (
      <div style={{
        border: `2px solid ${isSelected ? '#b71c1c' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'rgba(20,20,20,0.8)',
        boxShadow: isSelected ? '0 0 15px rgba(183,28,28,0.6)' : '0 4px 8px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s',
        position: 'relative'
      }}>
        {/* Thumbnail Clickable Link */}
        <a
          href={`https://thisvid.com${video.url.startsWith('/') ? video.url : '/' + video.url}`}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <div
            style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#000', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src={thumbs[hoverIndex]}
              alt={video.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isHovering ? 0.8 : 1, transition: 'opacity 0.2s' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/250x180?text=No+Image' }}
            />

            <span style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#f5deb3',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {video.duration}
            </span>
            {video.isPrivate && (
              <span style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'rgba(183,28,28,0.9)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                PRIVADO
              </span>
            )}
          </div>
        </a>

        {/* Metadata */}
        <div style={{ padding: '10px' }}>
          <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <a href={`https://thisvid.com${video.url.startsWith('/') ? video.url : '/' + video.url}`} target="_blank" rel="noreferrer" style={{ color: '#f5deb3', textDecoration: 'none' }}>
              {video.title || 'Sin Título'}
            </a>
          </h3>

          <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>👁️ {video.views ? video.views.toLocaleString() : 0} vistas</span>
            <span>📅 {video.date || 'Desconocido'}</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <button
              onClick={(e) => { e.preventDefault(); toggleSelectVideo(video); }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : '#b71c1c',
                color: '#f5deb3',
                border: isSelected ? '1px solid #b71c1c' : 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
            >
              {isSelected ? '❌ Quitar de Galería' : '⭐ Añadir a Galería'}
            </button>

            {viewMode === 'gallery' && (
              <button
                onClick={(e) => { e.preventDefault(); fetchRecommendations(video.url); }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: expandedVideo && expandedVideo.url === video.url ? '#333' : '#d4af37',
                  color: expandedVideo && expandedVideo.url === video.url ? '#f5deb3' : '#111',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '5px',
                  fontWeight: 'bold'
                }}
              >
                {expandedVideo && expandedVideo.url === video.url ? '🔽 Cerrar Recomendados' : '🎭 Mostrar Recomendados'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };"""

    new_videocard = """  const VideoCard = ({ video, isSelected }) => {
    const [isHovering, setIsHovering] = useState(false);
    const videoRef = React.useRef(null);
    const previewUrl = video.avatar ? video.avatar.replace(/\/[^\/]+\.jpg$/, '/preview.mp4') : null;

    const handlePlayClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActivePlayerVideo(video);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownloadClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showToast('Iniciando descarga (Beta)...');
      // A fallback download trigger for the exact preview/mp4
      const a = document.createElement('a');
      a.href = previewUrl;
      a.target = '_blank';
      a.download = video.title ? `${video.title}.mp4` : 'video.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const handleScrub = (e) => {
      if (videoRef.current && videoRef.current.duration) {
        const percent = parseFloat(e.target.value) / 100;
        videoRef.current.currentTime = percent * videoRef.current.duration;
      }
    };

    return (
      <div style={{
        border: `2px solid ${isSelected ? '#b71c1c' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'rgba(20,20,20,0.8)',
        boxShadow: isSelected ? '0 0 15px rgba(183,28,28,0.6)' : '0 4px 8px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Thumbnail Area with Preview & Overlays */}
        <div
          style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#000', cursor: 'pointer' }}
          onMouseEnter={(e) => {
            setIsHovering(true);
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
            }
          }}
          onMouseLeave={(e) => {
            setIsHovering(false);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
          }}
          onClick={handlePlayClick}
        >
          {isHovering && previewUrl ? (
            <video
              ref={videoRef}
              src={previewUrl}
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={video.avatar}
              alt={video.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/250x180?text=No+Image' }}
            />
          )}

          {/* Scrubbing Slider Overlay */}
          {isHovering && previewUrl && (
            <input
              type="range"
              min="0" max="100" defaultValue="0"
              onChange={handleScrub}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                margin: '0',
                cursor: 'ew-resize',
                opacity: 0.7,
                height: '8px',
                accentColor: '#b71c1c'
              }}
            />
          )}

          {/* Action Overlay */}
          {isHovering && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}>
              <button
                onClick={handlePlayClick}
                style={{ background: '#b71c1c', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Play Video"
              >
                ▶
              </button>
              <button
                onClick={handleDownloadClick}
                style={{ background: '#333', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Download Preview MP4"
              >
                ↓
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSelectVideo(video); }}
                style={{ background: isSelected ? '#fff' : '#333', color: isSelected ? '#b71c1c' : 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontWeight: 'bold' }}
                title="Magic Save"
              >
                ⭐
              </button>
            </div>
          )}

          <span style={{
            position: 'absolute',
            bottom: isHovering ? '15px' : '5px',
            right: '5px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#f5deb3',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none'
          }}>
            {video.duration}
          </span>
          {video.isPrivate && (
            <span style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              backgroundColor: 'rgba(183,28,28,0.9)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}>
              PRIVADO
            </span>
          )}
        </div>

        {/* Metadata */}
        <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <a href={`https://thisvid.com${video.url.startsWith('/') ? video.url : '/' + video.url}`} target="_blank" rel="noreferrer" style={{ color: '#f5deb3', textDecoration: 'none' }}>
              {video.title || 'Sin Título'}
            </a>
          </h3>

          <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>👁️ {video.views !== undefined && video.views !== null ? video.views.toLocaleString() : 0} vistas</span>
            <span>📅 {video.date || 'Desconocido'}</span>
          </div>

          {/* Quick Actions at bottom */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '5px', flexDirection: 'column' }}>
            {viewMode === 'gallery' && (
              <button
                onClick={(e) => { e.preventDefault(); fetchRecommendations(video.url); }}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: expandedVideo && expandedVideo.url === video.url ? '#333' : '#d4af37',
                  color: expandedVideo && expandedVideo.url === video.url ? '#f5deb3' : '#111',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {expandedVideo && expandedVideo.url === video.url ? '🔽 Cerrar Recomendados' : '🎭 Mostrar Recomendados'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };"""

    # Because indentation and minor whitespace differences can break replace(), we'll use a regex
    import re

    # We will search for the entire VideoCard function and replace it.
    # To do this safely, we find "const VideoCard = ({ video, isSelected }) => {"
    # and the next "return (" at the end of SimpleSearch component to not over-replace.
    # Actually, simpler: replace between "const VideoCard =" and "return (" of SimpleSearch.

    pattern = re.compile(r'  const VideoCard = \(\{ video, isSelected \}\) => \{.*?\n  return \(\n    <div style=\{\{ padding: \'20px\'', re.DOTALL)

    match = pattern.search(content)
    if match:
        new_content = content[:match.start()] + new_videocard + "\n\n  return (\n    <div style={{ padding: '20px'" + content[match.end():]
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Replaced VideoCard successfully in {filename}")
    else:
        print(f"Search string not found in {filename}")

if __name__ == "__main__":
    replace_in_file("src/SimpleSearch.js")
