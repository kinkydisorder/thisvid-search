import sys
import re

def replace_in_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    player_code = """
  // Player Component (Inline)
  const renderPlayer = () => {
    if (!activePlayerVideo) return null;

    // Extract video ID from URL for embed (e.g. from 'videos/some-video-name/' to 'some-video-name' or id if numerical)
    // Actually, thisvid uses numerical IDs for embed sometimes, or full path. Let's use the origin video page in an iframe since we don't have the exact embed API token, OR use the embed path.
    // The embed format is typically https://thisvid.com/embed/12345/
    // Since we don't always have the ID, we might need to rely on the URL path.
    const urlParts = activePlayerVideo.url.split('/').filter(p => p);
    // Usually url is like 'videos/12345/title-here/' or similar.

    return (
      <div style={{
        flex: '0 0 75%',
        position: 'sticky',
        top: '20px',
        height: 'calc(100vh - 40px)',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid #b71c1c',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 20px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: 'rgba(183,28,28,0.9)', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#f5deb3', fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activePlayerVideo.title}
          </h2>
          <button
            onClick={() => setActivePlayerVideo(null)}
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #f5deb3', color: '#f5deb3', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px' }}
          >
            Cerrar Player ✕
          </button>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <iframe
            src={`https://thisvid.com/${activePlayerVideo.url.startsWith('videos') ? activePlayerVideo.url : 'videos/' + activePlayerVideo.url}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            title={activePlayerVideo.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    );
  };
"""

    search_str = "const VideoCard = ({ video, isSelected }) => {"

    if search_str in content and "const renderPlayer =" not in content:
        new_content = content.replace(search_str, player_code + "\n  " + search_str)
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Added renderPlayer successfully in {filename}")
    else:
        print(f"Could not add renderPlayer in {filename}")

if __name__ == "__main__":
    replace_in_file("src/SimpleSearch.js")
