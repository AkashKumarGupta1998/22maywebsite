// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking links
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
// Post System with Password Protection
const postForm = document.getElementById('post-form');
const postsContainer = document.getElementById('posts-container');
const ADMIN_PASSWORD = "yourSecurePassword123"; // CHANGE THIS TO YOUR OWN PASSWORD

// Load existing posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('portfolio-posts')) || [];
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <h3>${post.title}</h3>
                <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Handle new post submission
postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = prompt("Enter admin password to post:");
    if (password !== ADMIN_PASSWORD) {
        alert("Incorrect password. Only authorized users can post.");
        return;
    }

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    if (!title || !content) {
        alert("Please fill in both title and content");
        return;
    }

    const newPost = {
        title,
        content,
        date: new Date().toISOString()
    };

    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem('portfolio-posts')) || [];
    existingPosts.unshift(newPost); // Add new post at beginning
    localStorage.setItem('portfolio-posts', JSON.stringify(existingPosts));
    
    // Refresh display
    loadPosts();
    
    // Reset form
    postForm.reset();
    
    alert("Post published successfully!");
});

// Initialize post system when page loads
document.addEventListener('DOMContentLoaded', loadPosts);
// Contact Form Submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        subject: this.querySelector('input[type="text"]:nth-of-type(2)').value,
        message: this.querySelector('textarea').value
    };

    // Here you would typically send this data to a server
    // For now, we'll just log it and show a success message
    console.log('Contact form submitted:', formData);
    
    // Show success message
    alert(`Thank you, ${formData.name}! Your message has been sent. I'll get back to you soon.`);
    
    // Reset form
    this.reset();
});
// Resume Download Button
document.getElementById('download-resume').addEventListener('click', function(e) {
    e.preventDefault();
    
    // In a real implementation, this would trigger a file download
    // For now, we'll simulate it
    alert("Resume download would start here. In production, link to your actual resume file.");
    
    // Example of how it would work with a real file:
    // window.open('path/to/your/resume.pdf', '_blank');
});
// POST SYSTEM v2 - With shareable links and admin control
const ADMIN_PASSWORD = "yourSecurePassword123"; // CHANGE THIS
const postsContainer = document.getElementById('posts-container');
const postForm = document.getElementById('post-form');

// Generate URL-friendly slug from title
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
}

// Load and display posts
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('portfolio-posts')) || [];
    postsContainer.innerHTML = '';
    
    // Check if viewing a single post from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    if (postSlug) {
        const singlePost = posts.find(p => p.slug === postSlug);
        if (singlePost) {
            displaySinglePost(singlePost);
            return;
        }
    }
    
    // Display all posts
    posts.forEach(post => {
        const postEl = document.createElement('article');
        postEl.className = 'post-card';
        postEl.innerHTML = `
            <div class="post-header">
                <h3><a href="?post=${post.slug}" class="post-link">${post.title}</a></h3>
                <div class="post-meta">
                    <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                    <div class="post-share">
                        <a href="#" class="share-btn" data-slug="${post.slug}">
                            <i class="fas fa-share-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
                ${post.content.length > 200 ? `<a href="?post=${post.slug}" class="read-more">Read more</a>` : ''}
            </div>
        `;
        postsContainer.appendChild(postEl);
    });
    
    initShareButtons();
}

// Display single post view
function displaySinglePost(post) {
    postsContainer.innerHTML = `
        <article class="single-post">
            <div class="post-header">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                    <div class="post-share">
                        <a href="#" class="share-btn" data-slug="${post.slug}">
                            <i class="fas fa-share-alt"></i> Share
                        </a>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <a href="#" class="btn back-to-posts"><i class="fas fa-arrow-left"></i> All Posts</a>
        </article>
    `;
    
    document.querySelector('.back-to-posts').addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', window.location.pathname);
        loadPosts();
    });
    
    initShareButtons();
}

// Initialize share buttons
function initShareButtons() {
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const slug = this.getAttribute('data-slug');
            const postUrl = `${window.location.origin}${window.location.pathname}?post=${slug}`;
            
            // Copy to clipboard
            navigator.clipboard.writeText(postUrl).then(() => {
                alert('Post link copied to clipboard!\n\nShare this URL: ' + postUrl);
            }).catch(() => {
                prompt('Copy this post URL to share:', postUrl);
            });
        });
    });
}

// Handle new post submission
postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = prompt("Enter admin password to post:");
    if (password !== ADMIN_PASSWORD) {
        alert("Incorrect password. Only authorized users can post.");
        return;
    }

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    if (!title || !content) {
        alert("Please fill in both title and content");
        return;
    }

    const newPost = {
        title,
        content,
        slug: createSlug(title),
        date: new Date().toISOString()
    };

    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem('portfolio-posts')) || [];
    existingPosts.unshift(newPost);
    localStorage.setItem('portfolio-posts', JSON.stringify(existingPosts));
    
    // Reset form and reload
    postForm.reset();
    loadPosts();
    alert("Post published successfully!");
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    loadPosts();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadPosts);
