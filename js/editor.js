/**
 * Leadership Blog Content Management System
 * Professional blog editor with complete CMS functionality
 * Fire Leadership and Management Excellence content creation tool
 */

/*
 * ========================================
 * MAIN CONTENT MANAGEMENT SYSTEM CLASS
 * ========================================
 */

/**
 * Leadership Blog Content Management System
 * A comprehensive blog editor with rich text editing, article management,
 * import/export functionality, and mobile-responsive design.
 *
 * @class LeadershipBlogCMS
 * @description Main CMS class that handles all blog editing functionality
 * @author Fire Leadership and Management Excellence
 * @version 1.0.0
 */
class LeadershipBlogCMS {
    /**
     * Initialize the Leadership Blog CMS
     * Sets up the Quill.js editor, event listeners, storage, and auto-save functionality
     *
     * @constructor
     */
    constructor() {
        // Initialize editor properties
        this.quill = null;
        this.currentArticle = null;
        this.autoSaveInterval = null;
        this.isModified = false;
        this.articles = [];
        this.filteredArticles = [];
        this.conflictResolution = 'auto';

        // Storage configuration
        this.storageKey = 'leadershipBlogArticles';
        this.autoSaveKey = 'leadershipBlogAutoSave';
        this.settingsKey = 'leadershipBlogSettings';

        // Initialize the CMS
        this.initializeEditor();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.loadArticles();
        this.startAutoSave();
        this.loadAutoSavedContent();
        this.updateStatistics();
    }

    /*
     * ========================================
     * QUILL.JS INITIALIZATION
     * ========================================
     */

    /**
     * Initialize the Quill.js rich text editor with professional toolbar
     * Configures comprehensive formatting options for leadership content creation
     *
     * @method initializeEditor
     * @description Sets up Quill.js with custom toolbar and event handlers
     * @returns {void}
     */
    initializeEditor() {
        // Quill.js toolbar configuration for professional content creation
        const toolbarOptions = [
            // Text formatting
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],

            // Text styling
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],

            // Text alignment and indentation
            [{ 'align': [] }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],

            // Lists and quotes
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],

            // Links and media
            ['link', 'image', 'video'],

            // Document actions
            ['clean']
        ];

        // Check if Quill is available
        if (typeof Quill === 'undefined') {
            console.error('❌ Quill.js is not loaded. Please check the CDN link.');
            this.handleError('Rich text editor failed to load', new Error('Quill.js not available'));
            return;
        }

        // Check if editor container exists
        const editorContainer = document.getElementById('quillEditor');
        if (!editorContainer) {
            console.error('❌ Quill editor container not found.');
            this.handleError('Editor container not found', new Error('quillEditor element missing'));
            return;
        }

        console.log('🔧 Initializing Quill editor...');

        // Initialize Quill editor
        this.quill = new Quill('#quillEditor', {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Start writing your leadership article...',
            readOnly: false
        });

        // Verify editor was created successfully
        if (!this.quill) {
            console.error('❌ Failed to create Quill editor instance');
            this.handleError('Editor initialization failed', new Error('Quill instance is null'));
            return;
        }

        console.log('✅ Quill editor instance created successfully');

        // Test editor functionality
        try {
            this.quill.enable(true);
            this.quill.focus();
            console.log('✅ Quill editor is enabled and focused');
        } catch (error) {
            console.error('❌ Error enabling Quill editor:', error);
            this.handleError('Editor enable failed', error);
            return;
        }

        // Track content changes for auto-save and statistics
        this.quill.on('text-change', () => {
            this.isModified = true;
            this.updateStatistics();
            this.updateStatus('editing');
        });

        console.log('✅ Quill.js editor initialized successfully');
    }

    /*
     * ========================================
     * EVENT LISTENERS SETUP
     * ========================================
     */

    /**
     * Set up all event listeners for the CMS interface
     * Configures click handlers, keyboard shortcuts, and input monitoring
     *
     * @method setupEventListeners
     * @description Initializes all UI interaction handlers
     * @returns {void}
     */
    setupEventListeners() {
        // Header navigation buttons
        this.setupButtonListener('newArticle', () => this.newArticle());
        this.setupButtonListener('saveArticle', () => this.saveArticle());
        this.setupButtonListener('loadArticle', () => this.loadArticle());
        this.setupButtonListener('exportArticle', () => this.exportAsHTML());

        // Content Management buttons
        this.setupButtonListener('newArticleBtn', () => this.newArticle());
        this.setupButtonListener('refreshArticles', () => this.refreshArticlesList());
        this.setupButtonListener('duplicateArticle', () => this.duplicateCurrentArticle());

        // Import/Export buttons
        this.setupButtonListener('importText', () => this.importFromText());
        this.setupButtonListener('exportHTML', () => this.exportAsHTML());
        this.setupButtonListener('exportMarkdown', () => this.exportAsMarkdown());
        this.setupButtonListener('exportFlowtrack', () => this.exportForFlowtrack());
        this.setupButtonListener('copyClean', () => this.copyCleanHTML());
        this.setupButtonListener('backupAll', () => this.backupAllArticles());
        this.setupButtonListener('restoreBackup', () => this.restoreFromBackup());

        // Search and filter
        this.setupInputListener('articleSearch', () => this.filterArticles());
        this.setupInputListener('categoryFilter', () => this.filterArticles());

        // Sidebar action buttons
        this.setupButtonListener('insertTemplate', () => this.insertTemplate());
        this.setupButtonListener('previewArticle', () => this.previewArticle());
        this.setupButtonListener('formatCheck', () => this.formatCheck());

        // Article metadata inputs - track changes for auto-save
        this.setupInputListener('articleTitle', () => {
            this.isModified = true;
            this.updateStatistics();
        });

        this.setupInputListener('articleAuthor', () => {
            this.isModified = true;
        });

        this.setupInputListener('articleCategory', () => {
            this.isModified = true;
            this.filterArticles(); // Update filter when category changes
        });

        this.setupInputListener('publicationDate', () => {
            this.isModified = true;
        });

        this.setupInputListener('articleSummary', () => {
            this.isModified = true;
            this.updateStatistics();
        });

        // Set today's date as default for publication date
        const today = new Date().toISOString().split('T')[0];
        this.setValue('publicationDate', today);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window close warning for unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.isModified) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        });

        console.log('✅ Event listeners set up successfully');
    }

    /**
     * Helper method to safely set up button event listeners
     * Provides error handling for missing DOM elements
     *
     * @method setupButtonListener
     * @param {string} elementId - The ID of the button element
     * @param {Function} callback - The function to call when button is clicked
     * @returns {void}
     */
    setupButtonListener(elementId, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', callback);
        } else {
            console.warn(`⚠️ Element with ID '${elementId}' not found`);
        }
    }

    /**
     * Helper method to safely set up input event listeners
     * Handles both 'input' and 'change' events for form elements
     *
     * @method setupInputListener
     * @param {string} elementId - The ID of the input element
     * @param {Function} callback - The function to call when input changes
     * @returns {void}
     */
    setupInputListener(elementId, callback) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('input', callback);
            element.addEventListener('change', callback);
        } else {
            console.warn(`⚠️ Element with ID '${elementId}' not found`);
        }
    }

    /*
     * ========================================
     * CONTENT MANAGEMENT SYSTEM FUNCTIONS
     * ========================================
     */

    /**
     * Load all articles from localStorage and update the articles list
     * Initializes filtered articles array and updates the UI components
     *
     * @method loadArticles
     * @description Retrieves stored articles from localStorage and refreshes the UI
     * @returns {void}
     */
    loadArticles() {
        try {
            this.articles = this.getStoredArticles();
            this.filteredArticles = [...this.articles];
            this.renderArticlesList();
            this.updateTotalArticlesCount();
            console.log(`📚 Loaded ${this.articles.length} articles`);
        } catch (error) {
            this.handleError('Failed to load articles', error);
        }
    }

    /**
     * Save article to localStorage with automatic conflict resolution
     * Handles existing article updates and maintains chronological sorting
     *
     * @method saveToStorage
     * @param {Object} article - The article object to save
     * @param {string} article.id - Unique article identifier
     * @param {string} article.title - Article title
     * @param {string} article.updatedAt - Last update timestamp
     * @returns {boolean} Success status of the save operation
     * @throws {Error} When localStorage operations fail
     */
    saveToStorage(article) {
        try {
            const articles = this.getStoredArticles();
            const existingIndex = articles.findIndex(a => a.id === article.id);

            // Conflict resolution
            if (existingIndex >= 0) {
                const existing = articles[existingIndex];
                if (existing.updatedAt > article.updatedAt && this.conflictResolution === 'ask') {
                    if (!confirm('This article has been modified elsewhere. Overwrite changes?')) {
                        this.showNotification('Save cancelled due to conflict', 'warning');
                        return false;
                    }
                }
                articles[existingIndex] = article;
            } else {
                articles.push(article);
            }

            articles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            localStorage.setItem(this.storageKey, JSON.stringify(articles));

            this.loadArticles();
            this.clearAutoSave();
            this.updateStorageUsage();
            return true;
        } catch (error) {
            this.handleError('Failed to save article', error);
            return false;
        }
    }

    /**
     * Delete an article from storage after user confirmation
     * Clears the editor if the deleted article is currently loaded
     *
     * @method deleteArticle
     * @param {string} articleId - The unique ID of the article to delete
     * @returns {void}
     * @throws {Error} When deletion operation fails
     */
    deleteArticle(articleId) {
        try {
            const article = this.articles.find(a => a.id === articleId);
            if (!article) {
                this.showNotification('Article not found', 'error');
                return;
            }

            if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) {
                return;
            }

            const articles = this.getStoredArticles();
            const filteredArticles = articles.filter(a => a.id !== articleId);
            localStorage.setItem(this.storageKey, JSON.stringify(filteredArticles));

            // If we deleted the current article, clear the editor
            if (this.currentArticle && this.currentArticle.id === articleId) {
                this.newArticle();
            }

            this.loadArticles();
            this.showNotification('Article deleted successfully', 'success');
        } catch (error) {
            this.handleError('Failed to delete article', error);
        }
    }

    /**
     * Retrieve all stored articles from localStorage
     * Provides error handling for corrupted or missing data
     *
     * @method getStoredArticles
     * @description Safely retrieves and parses articles from browser storage
     * @returns {Array<Object>} Array of article objects, empty array if none found or error occurs
     */
    getStoredArticles() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Error loading articles:', error);
            return [];
        }
    }

    /**
     * Render the complete articles list in the sidebar with interactive elements
     * Creates HTML for each article with metadata and action buttons
     *
     * @method renderArticlesList
     * @description Generates and displays the articles list UI with load, copy, and delete actions
     * @returns {void}
     */
    renderArticlesList() {
        const listContainer = document.getElementById('articlesList');
        if (!listContainer) return;

        if (this.filteredArticles.length === 0) {
            listContainer.innerHTML = '<p class="empty-state">No articles found</p>';
            return;
        }

        listContainer.innerHTML = this.filteredArticles.map(article => {
            const isActive = this.currentArticle && this.currentArticle.id === article.id;
            const date = new Date(article.updatedAt).toLocaleDateString();
            const wordCount = article.wordCount || 0;

            return `
                <div class="article-item ${isActive ? 'active' : ''}" data-id="${article.id}">
                    <div class="article-title">${this.escapeHtml(article.title || 'Untitled')}</div>
                    <div class="article-meta">
                        <span class="article-date">${date} • ${wordCount} words</span>
                        ${article.category ? `<span class="article-category">${article.category}</span>` : ''}
                    </div>
                    <div class="article-actions">
                        <button class="article-action-btn" onclick="window.blogCMS.loadArticleById('${article.id}')">
                            Load
                        </button>
                        <button class="article-action-btn" onclick="window.blogCMS.duplicateArticle('${article.id}')">
                            Copy
                        </button>
                        <button class="article-action-btn danger" onclick="window.blogCMS.deleteArticle('${article.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Filter articles based on search term and category selection
     * Updates the filtered articles array and refreshes the display
     *
     * @method filterArticles
     * @description Applies search and category filters to the articles list
     * @returns {void}
     */
    filterArticles() {
        const searchTerm = this.getValue('articleSearch').toLowerCase();
        const categoryFilter = this.getValue('categoryFilter');

        this.filteredArticles = this.articles.filter(article => {
            const matchesSearch = !searchTerm ||
                article.title.toLowerCase().includes(searchTerm) ||
                (article.content && article.content.toLowerCase().includes(searchTerm)) ||
                (article.author && article.author.toLowerCase().includes(searchTerm));

            const matchesCategory = !categoryFilter || article.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        this.renderArticlesList();
    }

    /**
     * Load a specific article by its unique identifier
     * Populates the editor with the article's content and metadata
     *
     * @method loadArticleById
     * @param {string} articleId - The unique ID of the article to load
     * @returns {void}
     */
    loadArticleById(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            this.loadArticleData(article);
        } else {
            this.showNotification('Article not found', 'error');
        }
    }

    /**
     * Create a duplicate copy of an existing article
     * Generates new ID and timestamps while preserving content
     *
     * @method duplicateArticle
     * @param {string} articleId - The ID of the article to duplicate
     * @returns {void}
     * @throws {Error} When duplication operation fails
     */
    duplicateArticle(articleId) {
        try {
            const article = this.articles.find(a => a.id === articleId);
            if (!article) {
                this.showNotification('Article not found', 'error');
                return;
            }

            const duplicate = {
                ...article,
                id: this.generateArticleId(),
                title: `Copy of ${article.title}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (this.saveToStorage(duplicate)) {
                this.loadArticleData(duplicate);
                this.showNotification('Article duplicated successfully', 'success');
            }
        } catch (error) {
            this.handleError('Failed to duplicate article', error);
        }
    }

    /**
     * Duplicate the currently loaded article in the editor
     * Provides user feedback if no article is currently loaded
     *
     * @method duplicateCurrentArticle
     * @description Creates a copy of the article currently being edited
     * @returns {void}
     */
    duplicateCurrentArticle() {
        if (!this.currentArticle) {
            this.showNotification('No article to duplicate', 'warning');
            return;
        }
        this.duplicateArticle(this.currentArticle.id);
    }

    /**
     * Refresh the articles list by reloading from storage
     * Useful for updating the UI after external changes
     *
     * @method refreshArticlesList
     * @description Reloads articles from storage and updates the UI display
     * @returns {void}
     */
    refreshArticlesList() {
        this.loadArticles();
        this.showNotification('Articles list refreshed', 'success');
    }

    /*
     * ========================================
     * IMPORT/EXPORT FUNCTIONALITY
     * ========================================
     */

    /**
     * Import article content from a text or markdown file
     * Opens file dialog and processes the selected file for import
     *
     * @method importFromText
     * @description Allows users to import articles from .txt or .md files
     * @returns {void}
     * @throws {Error} When file reading or processing fails
     */
    importFromText() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.md';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const content = e.target.result;
                        const lines = content.split('\\n');
                        const title = lines[0] || 'Imported Article';
                        const text = lines.slice(1).join('\\n');

                        this.newArticle();
                        this.setValue('articleTitle', title);
                        if (this.quill) {
                            this.quill.setText(text);
                        }
                        this.isModified = true;
                        this.updateStatistics();
                        this.showNotification('Article imported successfully', 'success');
                    } catch (error) {
                        this.handleError('Failed to import file', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    /**
     * Export the current article as a formatted HTML file
     * Generates a complete HTML document with styling and metadata
     *
     * @method exportAsHTML
     * @description Creates and downloads an HTML version of the current article
     * @returns {void}
     */
    exportAsHTML() {
        const articleData = this.gatherArticleData();
        if (!articleData.title.trim() && !articleData.content.trim()) {
            this.showNotification('Nothing to export', 'warning');
            return;
        }

        const html = this.generateExportHTML(articleData);
        this.downloadFile(html, `${articleData.title || 'article'}.html`, 'text/html');
        this.showNotification('Article exported as HTML', 'success');
    }

    /**
     * Export the current article as a Markdown file
     * Converts HTML content to Markdown format with metadata
     *
     * @method exportAsMarkdown
     * @description Creates and downloads a Markdown version of the current article
     * @returns {void}
     */
    exportAsMarkdown() {
        const articleData = this.gatherArticleData();
        if (!articleData.title.trim() && !articleData.content.trim()) {
            this.showNotification('Nothing to export', 'warning');
            return;
        }

        const markdown = this.generateMarkdown(articleData);
        this.downloadFile(markdown, `${articleData.title || 'article'}.md`, 'text/markdown');
        this.showNotification('Article exported as Markdown', 'success');
    }

    /**
     * Export the current article as clean HTML optimized for Flowtrack.co
     * Removes editor-specific classes and provides clean markup
     *
     * @method exportForFlowtrack
     * @description Creates clean HTML output specifically for Flowtrack.co platform
     * @returns {void}
     */
    exportForFlowtrack() {
        const articleData = this.gatherArticleData();
        if (!articleData.title.trim() && !articleData.content.trim()) {
            this.showNotification('Nothing to export', 'warning');
            return;
        }

        const cleanHTML = this.generateFlowtrackHTML(articleData);
        this.copyToClipboard(cleanHTML);
        this.showNotification('Clean HTML copied for Flowtrack.co!', 'success');
    }

    /**
     * Copy clean HTML content to clipboard without editor styling
     * Useful for pasting into external platforms
     *
     * @method copyCleanHTML
     * @description Copies cleaned HTML content to the system clipboard
     * @returns {void}
     */
    copyCleanHTML() {
        const articleData = this.gatherArticleData();
        if (!articleData.htmlContent.trim()) {
            this.showNotification('No content to copy', 'warning');
            return;
        }

        const cleanHTML = this.cleanHTMLForExport(articleData.htmlContent);
        this.copyToClipboard(cleanHTML);
        this.showNotification('Clean HTML copied to clipboard!', 'success');
    }

    /**
     * Generate clean HTML specifically formatted for Flowtrack.co
     * Removes Quill-specific classes and provides semantic markup
     *
     * @method generateFlowtrackHTML
     * @param {Object} articleData - The article data to format
     * @returns {string} Clean HTML formatted for Flowtrack.co
     */
    generateFlowtrackHTML(articleData) {
        let cleanHTML = this.cleanHTMLForExport(articleData.htmlContent);

        return `<article class="blog-post">
    <header class="post-header">
        <h1 class="post-title">${this.escapeHtml(articleData.title)}</h1>
        ${articleData.author ? `<p class="post-author">By <span class="author-name">${this.escapeHtml(articleData.author)}</span></p>` : ''}
        ${articleData.publicationDate ? `<time class="post-date" datetime="${articleData.publicationDate}">${new Date(articleData.publicationDate).toLocaleDateString()}</time>` : ''}
        ${articleData.category ? `<span class="post-category">${this.escapeHtml(articleData.category)}</span>` : ''}
        ${articleData.summary ? `<div class="post-summary">${this.escapeHtml(articleData.summary)}</div>` : ''}
    </header>

    <div class="post-content">
        ${cleanHTML}
    </div>

    <footer class="post-footer">
        <p class="post-meta">
            ${articleData.wordCount} words • ${this.calculateReadingTime(articleData.wordCount)}
        </p>
    </footer>
</article>`;
    }

    /**
     * Clean HTML content by removing editor-specific classes and attributes
     * Preserves semantic structure while removing Quill.js artifacts
     *
     * @method cleanHTMLForExport
     * @param {string} htmlContent - Raw HTML content from the editor
     * @returns {string} Cleaned HTML suitable for external platforms
     */
    cleanHTMLForExport(htmlContent) {
        let cleanHTML = htmlContent;

        // Remove Quill-specific classes
        cleanHTML = cleanHTML.replace(/class="[^"]*ql-[^"]*[^"]*"/g, '');

        // Remove empty class attributes
        cleanHTML = cleanHTML.replace(/\s*class\s*=\s*""\s*/g, '');

        // Remove Quill-specific style attributes
        cleanHTML = cleanHTML.replace(/style="[^"]*ql-[^"]*[^"]*"/g, '');

        // Clean up extra whitespace
        cleanHTML = cleanHTML.replace(/\s+/g, ' ');
        cleanHTML = cleanHTML.replace(/>\s+</g, '><');

        // Normalize common formatting
        cleanHTML = cleanHTML.replace(/<p><br><\/p>/g, '<p>&nbsp;</p>');
        cleanHTML = cleanHTML.replace(/<p>\s*<\/p>/g, '<p>&nbsp;</p>');

        return cleanHTML.trim();
    }

    /**
     * Copy text content to the system clipboard
     * Supports modern Clipboard API with fallback for older browsers
     *
     * @method copyToClipboard
     * @param {string} text - The text content to copy
     * @returns {Promise<void>} Promise that resolves when copy is complete
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Create a complete backup of all articles in JSON format
     * Includes metadata and version information for restore compatibility
     *
     * @method backupAllArticles
     * @description Exports all articles to a timestamped JSON backup file
     * @returns {void}
     * @throws {Error} When backup creation fails
     */
    backupAllArticles() {
        try {
            const backup = {
                articles: this.articles,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const json = JSON.stringify(backup, null, 2);
            const timestamp = new Date().toISOString().slice(0, 10);
            this.downloadFile(json, `blog-backup-${timestamp}.json`, 'application/json');
            this.showNotification('Backup created successfully', 'success');
        } catch (error) {
            this.handleError('Failed to create backup', error);
        }
    }

    /**
     * Restore articles from a previously created JSON backup file
     * Validates backup format and prompts for confirmation before restore
     *
     * @method restoreFromBackup
     * @description Imports articles from a backup file, replacing current articles
     * @returns {void}
     * @throws {Error} When backup file is invalid or restore operation fails
     */
    restoreFromBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const backup = JSON.parse(e.target.result);
                        if (!backup.articles || !Array.isArray(backup.articles)) {
                            throw new Error('Invalid backup format');
                        }

                        if (!confirm(`Restore ${backup.articles.length} articles? This will overwrite existing articles.`)) {
                            return;
                        }

                        localStorage.setItem(this.storageKey, JSON.stringify(backup.articles));
                        this.loadArticles();
                        this.showNotification('Backup restored successfully', 'success');
                    } catch (error) {
                        this.handleError('Failed to restore backup', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    /**
     * Convert article data to Markdown format with metadata headers
     * Performs basic HTML to Markdown conversion for content
     *
     * @method generateMarkdown
     * @param {Object} articleData - The article data to convert
     * @param {string} articleData.title - Article title
     * @param {string} articleData.author - Article author
     * @param {string} articleData.htmlContent - HTML content to convert
     * @param {string} articleData.content - Plain text content
     * @returns {string} Formatted Markdown content with metadata
     */
    generateMarkdown(articleData) {
        let markdown = `# ${articleData.title}\n\n`;

        if (articleData.author) {
            markdown += `**Author:** ${articleData.author}\n`;
        }
        if (articleData.publicationDate) {
            markdown += `**Date:** ${articleData.publicationDate}\n`;
        }
        if (articleData.category) {
            markdown += `**Category:** ${articleData.category}\n`;
        }

        if (articleData.summary) {
            markdown += `\n**Summary:** ${articleData.summary}\n`;
        }

        markdown += `\n---\n\n`;

        // Convert HTML to basic Markdown
        if (articleData.htmlContent) {
            let content = articleData.htmlContent;
            // Basic HTML to Markdown conversion
            content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
            content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
            content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
            content = content.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
            content = content.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
            content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
            content = content.replace(/<br[^>]*>/gi, '\n');
            content = content.replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
            markdown += content;
        } else {
            markdown += articleData.content;
        }

        return markdown;
    }

    /*
     * ========================================
     * KEYBOARD SHORTCUTS
     * ========================================
     */

    /**
     * Process keyboard shortcuts for editor actions
     * Supports Ctrl+S (save), Ctrl+N (new), Ctrl+O (open), Ctrl+E (export), Ctrl+P (preview), Ctrl+D (duplicate)
     *
     * @method handleKeyboardShortcuts
     * @param {KeyboardEvent} event - The keyboard event to process
     * @returns {void}
     * @description Handles common keyboard shortcuts for productivity
     */
    handleKeyboardShortcuts(event) {
        // Ctrl+S: Save article
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            this.saveArticle();
        }

        // Ctrl+N: New article
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            this.newArticle();
        }

        // Ctrl+O: Load/Open article
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault();
            this.loadArticle();
        }

        // Ctrl+E: Export article
        if (event.ctrlKey && event.key === 'e') {
            event.preventDefault();
            this.exportAsHTML();
        }

        // Ctrl+P: Preview article
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault();
            this.previewArticle();
        }

        // Ctrl+D: Duplicate article
        if (event.ctrlKey && event.key === 'd') {
            event.preventDefault();
            this.duplicateCurrentArticle();
        }
    }

    /*
     * ========================================
     * ARTICLE MANAGEMENT FUNCTIONS
     * ========================================
     */

    /**
     * Create a new article by clearing all editor fields and content
     * Prompts user to save if there are unsaved changes
     *
     * @method newArticle
     * @description Initializes a fresh article editor session
     * @returns {void}
     */
    newArticle() {
        if (this.isModified) {
            if (!confirm('You have unsaved changes. Are you sure you want to start a new article?')) {
                return;
            }
        }

        // Clear all input fields
        this.setValue('articleTitle', '');
        this.setValue('articleAuthor', '');
        this.setValue('articleCategory', '');
        this.setValue('articleSummary', '');
        this.setValue('publicationDate', new Date().toISOString().split('T')[0]);

        // Clear Quill editor content
        if (this.quill) {
            this.quill.setContents([]);
        }

        // Reset state
        this.currentArticle = null;
        this.isModified = false;
        this.updateStatistics();
        this.updateStatus('new');
        this.renderArticlesList(); // Update active article highlighting

        // Focus on title input
        const titleInput = document.getElementById('articleTitle');
        if (titleInput) {
            titleInput.focus();
        }

        this.showNotification('New article started', 'success');
        console.log('📄 New article created');
    }

    /**
     * Save the current article content and metadata to localStorage
     * Validates required fields and provides user feedback
     *
     * @method saveArticle
     * @description Validates and saves the current article with all metadata
     * @returns {void}
     */
    saveArticle() {
        // Gather article data
        const articleData = this.gatherArticleData();

        // Validate required fields
        if (!articleData.title.trim()) {
            this.showNotification('Please enter a title for your article', 'warning');
            document.getElementById('articleTitle')?.focus();
            return;
        }

        if (!articleData.content.trim()) {
            this.showNotification('Please write some content for your article', 'warning');
            this.quill?.focus();
            return;
        }

        // Create article object
        const article = {
            id: this.currentArticle?.id || this.generateArticleId(),
            title: articleData.title,
            author: articleData.author,
            category: articleData.category,
            summary: articleData.summary,
            publicationDate: articleData.publicationDate,
            content: articleData.content,
            htmlContent: articleData.htmlContent,
            wordCount: articleData.wordCount,
            createdAt: this.currentArticle?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        if (this.saveToStorage(article)) {
            this.currentArticle = article;
            this.isModified = false;
            this.updateStatus('saved');
            this.showNotification('Article saved successfully!', 'success');
            console.log('💾 Article saved:', article.title);
        }
    }

    /**
     * Load an existing article from the saved articles list
     * Provides guidance to user for article selection
     *
     * @method loadArticle
     * @description Initiates the article loading process from storage
     * @returns {void}
     */
    loadArticle() {
        if (this.articles.length === 0) {
            this.showNotification('No saved articles found', 'info');
            return;
        }
        this.showNotification('Select an article from the sidebar to load', 'info');
    }

    /**
     * Export the current article (defaults to HTML format)
     * Wrapper method for the primary export functionality
     *
     * @method exportArticle
     * @description Exports the current article using the default HTML format
     * @returns {void}
     */
    exportArticle() {
        this.exportAsHTML();
    }

    /*
     * ========================================
     * DATA MANAGEMENT
     * ========================================
     */

    /**
     * Collect all article data from form fields and editor content
     * Compiles metadata, content, and statistics into a single object
     *
     * @method gatherArticleData
     * @description Extracts all article information from the UI elements
     * @returns {Object} Complete article data object with all fields
     * @returns {string} returns.title - Article title
     * @returns {string} returns.author - Article author
     * @returns {string} returns.content - Plain text content
     * @returns {string} returns.htmlContent - Rich HTML content
     * @returns {number} returns.wordCount - Calculated word count
     */
    gatherArticleData() {
        const title = this.getValue('articleTitle');
        const author = this.getValue('articleAuthor');
        const category = this.getValue('articleCategory');
        const summary = this.getValue('articleSummary');
        const publicationDate = this.getValue('publicationDate');

        // Get content from Quill editor
        const htmlContent = this.quill ? this.quill.root.innerHTML : '';
        const content = this.quill ? this.quill.getText() : '';
        const wordCount = this.calculateWordCount(content);

        return {
            title,
            author,
            category,
            summary,
            publicationDate,
            content,
            htmlContent,
            wordCount
        };
    }

    /**
     * Load article data into all editor fields and update UI state
     * Prompts user to save if there are unsaved changes
     *
     * @method loadArticleData
     * @param {Object} article - The article object to load
     * @param {string} article.title - Article title
     * @param {string} article.author - Article author
     * @param {string} article.htmlContent - Rich HTML content
     * @param {string} article.content - Plain text content
     * @returns {void}
     */
    loadArticleData(article) {
        if (this.isModified) {
            if (!confirm('You have unsaved changes. Are you sure you want to load a different article?')) {
                return;
            }
        }

        // Populate form fields
        this.setValue('articleTitle', article.title || '');
        this.setValue('articleAuthor', article.author || '');
        this.setValue('articleCategory', article.category || '');
        this.setValue('articleSummary', article.summary || '');
        this.setValue('publicationDate', article.publicationDate || new Date().toISOString().split('T')[0]);

        // Load content into Quill editor
        if (this.quill && article.htmlContent) {
            this.quill.root.innerHTML = article.htmlContent;
        } else if (this.quill && article.content) {
            this.quill.setText(article.content);
        }

        // Update state
        this.currentArticle = article;
        this.isModified = false;
        this.updateStatistics();
        this.updateStatus('loaded');
        this.renderArticlesList(); // Update active article highlighting

        this.showNotification(`Article "${article.title}" loaded successfully`, 'success');
        console.log('📂 Article loaded:', article.title);
    }

    /*
     * ========================================
     * AUTO-SAVE FUNCTIONALITY
     * ========================================
     */

    /**
     * Initialize automatic saving functionality with 30-second intervals
     * Creates a persistent interval for auto-saving modified content
     *
     * @method startAutoSave
     * @description Sets up automatic content saving every 30 seconds
     * @returns {void}
     */
    startAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            if (this.isModified) {
                this.performAutoSave();
            }
        }, 30000);

        console.log('🔄 Auto-save started');
    }

    /**
     * Execute auto-save operation for current article content
     * Only saves if there is meaningful content (title or content)
     *
     * @method performAutoSave
     * @description Automatically saves current work to prevent data loss
     * @returns {void}
     * @throws {Error} When auto-save operation fails
     */
    performAutoSave() {
        const articleData = this.gatherArticleData();

        // Only auto-save if there's meaningful content
        if (articleData.title.trim() || articleData.content.trim()) {
            const autoSaveData = {
                ...articleData,
                timestamp: new Date().toISOString()
            };

            try {
                localStorage.setItem(this.autoSaveKey, JSON.stringify(autoSaveData));
                this.updateStatus('auto-saved');
                console.log('🔄 Auto-saved');
            } catch (error) {
                console.error('❌ Auto-save failed:', error);
            }
        }
    }

    /**
     * Restore auto-saved content when the application loads
     * Prompts user to restore recent auto-saved work (within 24 hours)
     *
     * @method loadAutoSavedContent
     * @description Checks for and optionally restores auto-saved content on startup
     * @returns {void}
     */
    loadAutoSavedContent() {
        try {
            const autoSaved = localStorage.getItem(this.autoSaveKey);
            if (autoSaved) {
                const data = JSON.parse(autoSaved);

                // Only load if there's meaningful content and it's recent (within 24 hours)
                const autoSaveTime = new Date(data.timestamp);
                const now = new Date();
                const hoursDiff = (now - autoSaveTime) / (1000 * 60 * 60);

                if (hoursDiff < 24 && (data.title.trim() || data.content.trim())) {
                    if (confirm('Auto-saved content found. Would you like to restore it?')) {
                        this.setValue('articleTitle', data.title);
                        this.setValue('articleAuthor', data.author);
                        this.setValue('articleCategory', data.category);
                        this.setValue('articleSummary', data.summary);
                        this.setValue('publicationDate', data.publicationDate || new Date().toISOString().split('T')[0]);

                        if (this.quill && data.htmlContent) {
                            this.quill.root.innerHTML = data.htmlContent;
                        } else if (this.quill && data.content) {
                            this.quill.setText(data.content);
                        }

                        this.isModified = true;
                        this.updateStatistics();
                        this.showNotification('Auto-saved content restored', 'info');
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error loading auto-saved content:', error);
        }
    }

    /**
     * Remove auto-saved content from localStorage
     * Called after successful manual save to clean up temporary data
     *
     * @method clearAutoSave
     * @description Removes auto-save data from browser storage
     * @returns {void}
     */
    clearAutoSave() {
        localStorage.removeItem(this.autoSaveKey);
    }

    /*
     * ========================================
     * STATISTICS AND STATUS UPDATES
     * ========================================
     */

    /**
     * Update article statistics display including word count, reading time, and character count
     * Provides visual feedback on article length and complexity
     *
     * @method updateStatistics
     * @description Calculates and displays real-time article statistics
     * @returns {void}
     */
    /*
     * ========================================
     * MOBILE MENU FUNCTIONALITY
     * ========================================
     */

    /**
     * Setup mobile hamburger menu functionality
     * Handles responsive navigation menu for screens smaller than 768px
     *
     * @method setupMobileMenu
     * @description Configures hamburger menu toggle, outside click handling, and responsive behavior
     * @returns {void}
     */
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const headerNav = document.getElementById('headerNav');

        if (mobileToggle && headerNav) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                headerNav.classList.toggle('mobile-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !headerNav.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    headerNav.classList.remove('mobile-open');
                }
            });

            // Close menu when window is resized to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    mobileToggle.classList.remove('active');
                    headerNav.classList.remove('mobile-open');
                }
            });
        }
    }

    updateStatistics() {
        const content = this.quill ? this.quill.getText() : '';
        const wordCount = this.calculateWordCount(content);
        const paragraphCount = this.calculateParagraphCount();
        const readingTime = this.calculateReadingTime(wordCount);

        // Update display elements
        this.setTextContent('wordCount', `${wordCount} words`);
        this.setTextContent('liveWordCount', `${wordCount} words`);
        this.setTextContent('charCount', `${content.length} characters`);
        this.setTextContent('paragraphCount', paragraphCount.toString());
        this.setTextContent('readingTime', readingTime);

        // Update word count styling based on length
        const liveWordCountElement = document.getElementById('liveWordCount');
        if (liveWordCountElement) {
            if (wordCount < 100) {
                liveWordCountElement.style.color = 'var(--color-warning)';
            } else if (wordCount > 2000) {
                liveWordCountElement.style.color = 'var(--color-error)';
            } else {
                liveWordCountElement.style.color = 'var(--color-success)';
            }
        }
    }

    /**
     * Update the total articles count display in the UI
     * Reflects the current number of saved articles
     *
     * @method updateTotalArticlesCount
     * @description Updates the articles count indicator in the interface
     * @returns {void}
     */
    updateTotalArticlesCount() {
        this.setTextContent('totalArticles', this.articles.length.toString());
    }

    /**
     * Calculate and display current localStorage usage percentage
     * Warns users when storage is approaching capacity limits
     *
     * @method updateStorageUsage
     * @description Monitors and displays browser storage usage statistics
     * @returns {void}
     */
    updateStorageUsage() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                }
            }

            // Approximate storage limit (5MB for most browsers)
            const storageLimit = 5 * 1024 * 1024;
            const usagePercent = Math.round((totalSize / storageLimit) * 100);

            this.setTextContent('storageUsed', `${usagePercent}%`);

            // Warning if storage is getting full
            if (usagePercent > 80) {
                this.showNotification('Storage is getting full. Consider backing up articles.', 'warning');
            }
        } catch (error) {
            this.setTextContent('storageUsed', 'N/A');
        }
    }

    /**
     * Calculate word count from text content using whitespace splitting
     * Handles empty content and provides accurate word counting
     *
     * @method calculateWordCount
     * @param {string} text - The text content to count words in
     * @returns {number} The number of words in the text
     */
    calculateWordCount(text) {
        return text.trim() ? text.trim().split(/\\s+/).length : 0;
    }

    /**
     * Calculate paragraph count from Quill editor content
     * Analyzes editor delta operations to count paragraph breaks
     *
     * @method calculateParagraphCount
     * @description Counts paragraphs in the rich text editor content
     * @returns {number} The number of paragraphs in the editor
     */
    calculateParagraphCount() {
        if (!this.quill) return 0;

        const delta = this.quill.getContents();
        let paragraphs = 0;

        delta.ops.forEach(op => {
            if (op.insert && typeof op.insert === 'string') {
                paragraphs += (op.insert.match(/\n/g) || []).length;
            }
        });

        return Math.max(1, paragraphs);
    }

    /**
     * Calculate estimated reading time based on word count
     * Uses average reading speed of 200 words per minute
     *
     * @method calculateReadingTime
     * @param {number} wordCount - The total number of words in the article
     * @returns {string} Formatted reading time estimate (e.g., "5 min")
     */
    calculateReadingTime(wordCount) {
        const wordsPerMinute = 200; // Average reading speed
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    }

    /**
     * Update the status bar with current editor state
     * Displays save status, editing state, and other status information
     *
     * @method updateStatus
     * @param {string} status - The status to display ('new', 'editing', 'saved', 'auto-saved', 'loaded', 'error')
     * @returns {void}
     */
    updateStatus(status) {
        const statusText = {
            'new': 'New article',
            'editing': 'Editing...',
            'saved': 'Saved',
            'auto-saved': 'Auto-saved',
            'loaded': 'Loaded',
            'error': 'Error'
        };

        const lastSavedElement = document.getElementById('lastSaved');
        if (lastSavedElement) {
            lastSavedElement.textContent = statusText[status] || status;
        }

        if (status === 'saved' || status === 'auto-saved') {
            setTimeout(() => {
                if (lastSavedElement) {
                    lastSavedElement.textContent = 'Saved';
                }
            }, 2000);
        }
    }

    /*
     * ========================================
     * SIDEBAR FUNCTIONS
     * ========================================
     */

    /**
     * Insert a pre-defined template into the editor
     * Provides templates for leadership and safety content
     *
     * @method insertTemplate
     * @description Allows users to insert structured templates for common article types
     * @returns {void}
     */
    insertTemplate() {
        const templates = {
            'leadership': `# Leadership Principles\\n\\n## Introduction\\n\\nLeadership in the fire service requires...\\n\\n## Key Principles\\n\\n1. **Lead by Example**\\n2. **Communicate Effectively**\\n3. **Make Informed Decisions**\\n\\n## Conclusion\\n\\n`,
            'safety': `# Safety Protocol\\n\\n## Overview\\n\\nSafety is our top priority...\\n\\n## Procedures\\n\\n### Before Operations\\n- [ ] Check equipment\\n- [ ] Review procedures\\n\\n### During Operations\\n- [ ] Maintain communication\\n- [ ] Follow protocols\\n\\n## Emergency Procedures\\n\\n`
        };

        const template = prompt('Select template:\\n1. Leadership\\n2. Safety\\n\\nEnter number:');

        if (template === '1' && this.quill) {
            this.quill.setText(templates.leadership);
            this.showNotification('Leadership template inserted', 'success');
        } else if (template === '2' && this.quill) {
            this.quill.setText(templates.safety);
            this.showNotification('Safety template inserted', 'success');
        }
    }

    /**
     * Open article preview in a new window
     * Displays formatted article content as it would appear when published
     *
     * @method previewArticle
     * @description Opens a formatted preview of the current article in a new browser window
     * @returns {void}
     */
    previewArticle() {
        const articleData = this.gatherArticleData();

        if (!articleData.title.trim() && !articleData.content.trim()) {
            this.showNotification('Nothing to preview', 'warning');
            return;
        }

        // Create a simple preview window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        const previewHTML = this.generatePreviewHTML(articleData);
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();

        this.showNotification('Preview opened in new window', 'success');
        console.log('👁️ Article preview opened');
    }

    /**
     * Perform comprehensive formatting and content validation check
     * Identifies missing fields, content length issues, and formatting problems
     *
     * @method formatCheck
     * @description Validates article completeness and provides formatting recommendations
     * @returns {void}
     */
    formatCheck() {
        const articleData = this.gatherArticleData();
        const issues = [];

        if (!articleData.title.trim()) {
            issues.push('Missing title');
        }

        if (!articleData.author.trim()) {
            issues.push('Missing author');
        }

        if (articleData.wordCount < 50) {
            issues.push('Article is very short (under 50 words)');
        }

        if (articleData.wordCount > 2000) {
            issues.push('Article is very long (over 2000 words)');
        }

        if (!articleData.summary.trim()) {
            issues.push('Missing summary');
        }

        if (issues.length === 0) {
            this.showNotification('No formatting issues found!', 'success');
        } else {
            this.showNotification(`Issues found: ${issues.join(', ')}`, 'warning');
        }
    }

    /*
     * ========================================
     * UTILITY FUNCTIONS
     * ========================================
     */

    /**
     * Generate a unique identifier for new articles
     * Combines timestamp and random string for uniqueness
     *
     * @method generateArticleId
     * @description Creates a unique ID for article identification and storage
     * @returns {string} Unique article identifier
     */
    generateArticleId() {
        return 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Safely retrieve the value of a DOM element by ID
     * Provides null-safe access to form element values
     *
     * @method getValue
     * @param {string} elementId - The ID of the element to get value from
     * @returns {string} The element's value, or empty string if element not found
     */
    getValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value : '';
    }

    /**
     * Safely set the value of a DOM element by ID
     * Provides null-safe value assignment to form elements
     *
     * @method setValue
     * @param {string} elementId - The ID of the element to set value for
     * @param {string} value - The value to assign to the element
     * @returns {void}
     */
    setValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        }
    }

    /**
     * Safely set the text content of a DOM element by ID
     * Provides null-safe text content assignment
     *
     * @method setTextContent
     * @param {string} elementId - The ID of the element to set text for
     * @param {string} text - The text content to assign
     * @returns {void}
     */
    setTextContent(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Escape HTML characters to prevent XSS attacks
     * Converts special characters to their HTML entity equivalents
     *
     * @method escapeHtml
     * @param {string} text - The text to escape
     * @returns {string} HTML-escaped text safe for display
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Trigger download of file content with specified name and MIME type
     * Creates temporary blob URL for browser download functionality
     *
     * @method downloadFile
     * @param {string} content - The file content to download
     * @param {string} filename - The name for the downloaded file
     * @param {string} mimeType - The MIME type of the file
     * @returns {void}
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Handle errors with console logging and user notification
     * Provides consistent error handling across the application
     *
     * @method handleError
     * @param {string} message - User-friendly error message
     * @param {Error} error - The error object for console logging
     * @returns {void}
     */
    handleError(message, error) {
        console.error(`❌ ${message}:`, error);
        this.showNotification(`${message}. Please try again.`, 'error');
    }

    /**
     * Display notification message to user with specified type styling
     * Creates temporary notification with auto-removal after 4 seconds
     *
     * @method showNotification
     * @param {string} message - The message to display to the user
     * @param {string} [type='info'] - The notification type ('success', 'error', 'warning', 'info')
     * @returns {void}
     */
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;

        // Set background color based on type
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    /**
     * Generate complete HTML document for article export
     * Creates standalone HTML file with embedded CSS and article content
     *
     * @method generateExportHTML
     * @param {Object} articleData - The article data to format
     * @param {string} articleData.title - Article title
     * @param {string} articleData.author - Article author
     * @param {string} articleData.htmlContent - Rich HTML content
     * @returns {string} Complete HTML document as string
     */
    generateExportHTML(articleData) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; }
        h1 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; }
        .content { font-size: 16px; }
        .summary { background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>${articleData.title}</h1>
    <div class="meta">
        ${articleData.author ? `<strong>Author:</strong> ${articleData.author}<br>` : ''}
        ${articleData.category ? `<strong>Category:</strong> ${articleData.category}<br>` : ''}
        ${articleData.publicationDate ? `<strong>Date:</strong> ${articleData.publicationDate}<br>` : ''}
        <strong>Word Count:</strong> ${articleData.wordCount} words<br>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
    </div>
    ${articleData.summary ? `<div class="summary"><strong>Summary:</strong> ${articleData.summary}</div>` : ''}
    <div class="content">${articleData.htmlContent}</div>
</body>
</html>`;
    }

    /**
     * Generate HTML for article preview display
     * Uses the same formatting as export for consistent preview
     *
     * @method generatePreviewHTML
     * @param {Object} articleData - The article data to preview
     * @returns {string} HTML content for preview window
     */
    generatePreviewHTML(articleData) {
        return this.generateExportHTML(articleData);
    }
}

/*
 * ========================================
 * INITIALIZATION
 * ========================================
 */

// Initialize the CMS when DOM is fully loaded and Quill is available
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Leadership Blog CMS...');

    // Wait for Quill.js to be available
    function initializeCMS() {
        if (typeof Quill !== 'undefined') {
            console.log('✅ Quill.js is available, initializing CMS...');
            // Make CMS globally accessible
            window.blogCMS = new LeadershipBlogCMS();
            console.log('✅ Leadership Blog CMS initialized successfully');
        } else {
            console.log('⏳ Waiting for Quill.js to load...');
            setTimeout(initializeCMS, 100);
        }
    }

    initializeCMS();

    // Add CSS animation for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});