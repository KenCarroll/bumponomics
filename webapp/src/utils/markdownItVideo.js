// Custom MarkdownIt plugin for YouTube embeds
// Usage: @[youtube](video_id_or_url)

const YouTubeEmbed = (md) => {
  const YT_REGEX = /^@\[youtube\]\((.+?)\)/;

  md.renderer.rules.youtube_embed = (tokens, idx) => {
    const token = tokens[idx];
    const videoUrl = token.content;
    let videoId = videoUrl;

    // Try to extract ID from URL if full URL is provided
    // Matches:
    // https://www.youtube.com/watch?v=ID
    // https://youtu.be/ID
    // https://youtube.com/embed/ID
    const urlPattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(urlPattern);
    
    if (match && match[1]) {
      videoId = match[1];
    }

    return `<div class="video-responsive">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/${videoId}" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>`
  };

  md.inline.ruler.before('emphasis', 'youtube_embed', (state, silent) => {
    const max = state.posMax;
    const start = state.pos;

    if (state.src.charCodeAt(start) !== 64 /* @ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 91 /* [ */) { return false; }

    const match = YT_REGEX.exec(state.src.slice(start));
    if (!match) { return false; }

    if (silent) { return true; }

    const token = state.push('youtube_embed', 'div', 0);
    token.content = match[1];
    state.pos += match[0].length;

    return true;
  });
};

export default YouTubeEmbed;
