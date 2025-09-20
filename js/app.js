// Blog Editor Application
class BlogEditor {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadAutoSave();
    }

    initializeElements() {
        this.titleInput = document.getElementById('postTitle');
        this.contentTextarea = document.getElementById('postContent');
        this.newPostBtn = document.getElementById('newPost');
        this.savePostBtn = document.getElementById('savePost');
        this.loadPostBtn = document.getElementById('loadPost');
    }

    setupEventListeners() {
        // Button event listeners
        this.newPostBtn.addEventListener('click', () => this.newPost());
        this.savePostBtn.addEventListener('click', () => this.savePost());
        this.loadPostBtn.addEventListener('click', () => this.loadPost());

        // Auto-save functionality
        this.titleInput.addEventListener('input', () => this.autoSave());
        this.contentTextarea.addEventListener('input', () => this.autoSave());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    newPost() {
        if (this.hasUnsavedChanges()) {
            if (!confirm('You have unsaved changes. Are you sure you want to start a new post?')) {
                return;
            }
        }

        this.titleInput.value = '';
        this.contentTextarea.value = '';
        this.titleInput.focus();
        this.clearAutoSave();

        this.showNotification('New post started');
    }

    savePost() {
        const title = this.titleInput.value.trim();
        const content = this.contentTextarea.value.trim();

        if (!title && !content) {
            this.showNotification('Nothing to save', 'warning');
            return;
        }

        const post = {
            title: title || 'Untitled Post',
            content: content,
            timestamp: new Date().toISOString(),
            id: this.generateId()
        };

        // Save to localStorage
        const savedPosts = this.getSavedPosts();
        savedPosts.push(post);
        localStorage.setItem('blogPosts', JSON.stringify(savedPosts));

        this.clearAutoSave();
        this.showNotification('Post saved successfully!');
    }

    loadPost() {
        const savedPosts = this.getSavedPosts();

        if (savedPosts.length === 0) {
            this.showNotification('No saved posts found', 'warning');
            return;
        }

        // Create a simple selection dialog
        this.showPostSelector(savedPosts);
    }

    showPostSelector(posts) {
        // Create modal for post selection
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Select a post to load:</h3>
                <div class="post-list">
                    ${posts.map(post => `
                        <div class="post-item" data-id="${post.id}">
                            <div class="post-title">${post.title}</div>
                            <div class="post-date">${new Date(post.timestamp).toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 0.5rem;
                max-width: 500px;
                width: 90%;
                max-height: 70vh;
                overflow-y: auto;
            }
            .post-item {
                padding: 1rem;
                border: 1px solid #e9ecef;
                border-radius: 0.375rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: background 0.2s;
            }
            .post-item:hover {
                background: #f8f9fa;
            }
            .post-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            .post-date {
                color: #6c757d;
                font-size: 0.875rem;
            }
            .modal-buttons {
                margin-top: 1rem;
                text-align: right;
            }
            .cancel-btn {
                padding: 0.5rem 1rem;
                border: 1px solid #dee2e6;
                border-radius: 0.375rem;
                background: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Event listeners for modal
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        modal.querySelectorAll('.post-item').forEach(item => {
            item.addEventListener('click', () => {
                const postId = item.dataset.id;
                const post = posts.find(p => p.id === postId);

                if (post) {
                    if (this.hasUnsavedChanges()) {
                        if (!confirm('You have unsaved changes. Are you sure you want to load a different post?')) {
                            return;
                        }
                    }

                    this.titleInput.value = post.title;
                    this.contentTextarea.value = post.content;
                    this.clearAutoSave();
                    this.showNotification('Post loaded successfully');
                }

                document.body.removeChild(modal);
                document.head.removeChild(style);
            });
        });
    }

    autoSave() {
        const post = {
            title: this.titleInput.value,
            content: this.contentTextarea.value,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('blogEditorAutoSave', JSON.stringify(post));
    }

    loadAutoSave() {
        const autoSave = localStorage.getItem('blogEditorAutoSave');
        if (autoSave) {
            const post = JSON.parse(autoSave);
            if (post.title || post.content) {
                this.titleInput.value = post.title;
                this.contentTextarea.value = post.content;
                this.showNotification('Auto-saved content restored');
            }
        }
    }

    clearAutoSave() {
        localStorage.removeItem('blogEditorAutoSave');
    }

    hasUnsavedChanges() {
        const autoSave = localStorage.getItem('blogEditorAutoSave');
        if (!autoSave) return false;

        const post = JSON.parse(autoSave);
        return post.title.trim() !== '' || post.content.trim() !== '';
    }

    getSavedPosts() {
        const posts = localStorage.getItem('blogPosts');
        return posts ? JSON.parse(posts) : [];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.savePost();
        }
        // Ctrl+N for new post
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            this.newPost();
        }
    }

    showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.375rem;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            .notification-success {
                background: #28a745;
            }
            .notification-warning {
                background: #ffc107;
                color: #212529;
            }
            .notification-error {
                background: #dc3545;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;

        if (!document.querySelector('style[data-notification]')) {
            style.setAttribute('data-notification', 'true');
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize the blog editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogEditor();
});