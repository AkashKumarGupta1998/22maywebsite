// GitHub API integration
async function loadPosts() {
  const postsContainer = document.getElementById('posts-container');
  
  try {
    const response = await fetch('https://api.github.com/https://github.com/AkashKumarGupta1998/22maywebsite/edit/main/scripts/posts.js', {
  headers: {
    Authorization: `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`
  }
})
    
    if (!response.ok) throw new Error('Failed to load posts');
    
    const files = await response.json();
    
    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const postResponse = await fetch(file.download_url);
        const markdown = await postResponse.text();
        
        // Parse front matter (between --- lines)
        const content = markdown.split('---')[2];
        const metadata = markdown.split('---')[1];
        const title = metadata.match(/title: "(.*?)"/)[1];
        const date = metadata.match(/date: (.*?)\n/)[1];
        
        // Create post element
        const postEl = document.createElement('article');
        postEl.className = 'post-card';
        postEl.innerHTML = `
          <div class="post-header">
            <h3>${title}</h3>
            <span class="post-date">${date}</span>
          </div>
          <div class="post-content">
            ${marked.parse(content)} <!-- Using marked.js for Markdown -->
          </div>
          <a href="?post=${file.name.replace('.md', '')}" class="read-more">Permalink</a>
        `;
        
        postsContainer.appendChild(postEl);
      }
    }
  } catch (error) {
    postsContainer.innerHTML = `<p class="error">Error loading posts: ${error.message}</p>`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load Markdown parser library
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(script);
  
  script.onload = loadPosts;
});
