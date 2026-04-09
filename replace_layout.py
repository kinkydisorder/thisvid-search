import sys
import re

def replace_in_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Search for the grid rendering part:
    #       {/* Grid rendering selected or searched videos */}
    #       <div style={{
    #         display: 'flex',
    #         flexDirection: 'column',
    #         gap: '20px'
    #       }}>
    #         <div style={{
    #           display: 'grid',
    #           gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    #           gap: '20px'
    #         }}>

    old_layout = """      {/* Grid rendering selected or searched videos */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {displayedVideos.map((video) => (
            <VideoCard
              key={video.url}
              video={video}
              isSelected={selectedVideos.some(v => v.url === video.url)}
            />
          ))}
        </div>"""

    new_layout = """      {/* Player and Grid rendering selected or searched videos */}
      <div style={{
        display: 'flex',
        flexDirection: inSidebar ? 'row' : 'column',
        gap: '20px',
        alignItems: 'flex-start'
      }}>

        {renderPlayer()}

        <div style={{
          flex: inSidebar ? '0 0 calc(25% - 20px)' : '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${inSidebar ? '120px' : '250px'}, 1fr))`,
            gap: '20px'
          }}>
            {displayedVideos.map((video) => (
              <VideoCard
                key={video.url}
                video={video}
                isSelected={selectedVideos.some(v => v.url === video.url)}
              />
            ))}
          </div>"""

    if old_layout in content:
        new_content = content.replace(old_layout, new_layout)
        with open(filename, 'w') as f:
            f.write(new_content)
        print(f"Replaced layout successfully in {filename}")
    else:
        print(f"Search string not found in {filename}")

if __name__ == "__main__":
    replace_in_file("src/SimpleSearch.js")
