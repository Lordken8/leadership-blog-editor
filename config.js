/**
 * Leadership Blog Editor Configuration
 * Customize colors, branding, and functionality
 */

window.BLOG_EDITOR_CONFIG = {
    // Branding Configuration
    branding: {
        title: 'Leadership Blog Editor',
        subtitle: 'Fire Leadership and Management Excellence',
        logo: null, // URL to logo image or null
        favicon: 'assets/favicon.ico'
    },

    // Color Scheme Configuration
    colors: {
        primary: '#1e40af',        // Main brand color
        primaryLight: '#3b82f6',   // Lighter variant
        primaryDark: '#1e3a8a',    // Darker variant
        secondary: '#64748b',      // Secondary gray
        accent: '#f59e0b',         // Accent amber
        success: '#10b981',        // Success green
        warning: '#f59e0b',        // Warning amber
        error: '#ef4444',          // Error red
        background: '#ffffff',     // Main background
        backgroundSecondary: '#f9fafb', // Secondary background
        text: '#1f2937',          // Primary text
        textSecondary: '#6b7280',  // Secondary text
        border: '#e5e7eb'          // Border color
    },

    // Editor Configuration
    editor: {
        placeholder: 'Start writing your leadership article...',
        autoSave: true,
        autoSaveInterval: 30000, // 30 seconds
        wordCountWarning: 100,   // Words below this show warning
        wordCountLimit: 2000,    // Words above this show error

        // Toolbar configuration
        toolbar: {
            // Available options: 'full', 'basic', 'minimal', 'custom'
            preset: 'full',

            // Custom toolbar (only used if preset is 'custom')
            custom: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image']
            ]
        }
    },

    // Feature Configuration
    features: {
        articleManagement: true,
        searchAndFilter: true,
        importExport: true,
        templates: true,
        preview: true,
        formatCheck: true,
        duplicateArticle: true,
        statistics: true,
        mobileMenu: true,
        keyboardShortcuts: true,
        notifications: true
    },

    // Export Configuration
    export: {
        includeMetadata: true,
        includeStatistics: true,
        cleanHtmlForFlowtrack: true,

        // Default HTML template for exports
        htmlTemplate: 'standard', // 'standard', 'minimal', 'flowtrack'

        // CSS to include in HTML exports
        exportCSS: `
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
                color: #1f2937;
            }
            h1, h2, h3, h4, h5, h6 {
                color: #1f2937;
                margin-top: 2em;
                margin-bottom: 0.5em;
            }
            h1 {
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 0.5em;
            }
            .article-meta {
                color: #6b7280;
                font-size: 0.9em;
                margin-bottom: 2em;
                padding-bottom: 1em;
                border-bottom: 1px solid #e5e7eb;
            }
            blockquote {
                border-left: 4px solid #e5e7eb;
                padding-left: 1em;
                margin-left: 0;
                font-style: italic;
                color: #6b7280;
            }
        `
    },

    // Storage Configuration
    storage: {
        prefix: 'leadershipBlog', // localStorage key prefix
        compressionEnabled: false, // Enable gzip compression for large articles
        maxArticles: 1000,        // Maximum articles to store
        warningThreshold: 0.8     // Show storage warning at 80% capacity
    },

    // Notification Configuration
    notifications: {
        duration: 4000,           // How long notifications show (ms)
        position: 'top-right',    // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        showIcons: true,          // Show icons in notifications
        animations: true          // Enable slide-in animations
    },

    // Mobile Configuration
    mobile: {
        breakpoint: 768,          // Mobile breakpoint in pixels
        hideElementsOnMobile: ['sidebar'], // Elements to hide on mobile
        collapsibleSidebar: true, // Make sidebar collapsible on mobile
        swipeGestures: false      // Enable swipe gestures (future feature)
    },

    // Integration Configuration
    integration: {
        // Flowtrack.co specific settings
        flowtrack: {
            cleanCSS: true,           // Remove all CSS classes
            semanticHTML: true,       // Use semantic HTML5 elements
            includeMetadata: true,    // Include article metadata
            customClasses: {          // Custom CSS classes for Flowtrack
                article: 'blog-post',
                title: 'post-title',
                author: 'post-author',
                date: 'post-date',
                content: 'post-content',
                category: 'post-category'
            }
        },

        // Embedded editor settings
        embedded: {
            allowedOrigins: ['*'],    // Allowed parent origins for iframe
            defaultWidth: '100%',
            defaultHeight: '600px',
            enablePostMessage: true,  // Enable communication with parent
            hideElementsByDefault: ['brand'] // Elements to hide in embedded mode
        }
    },

    // Categories Configuration
    categories: [
        'leadership',
        'management',
        'training',
        'strategy',
        'operations',
        'safety',
        'emergency-response',
        'team-building',
        'communication',
        'decision-making'
    ],

    // Templates Configuration
    templates: {
        leadership: {
            title: 'Leadership Principles',
            content: `# Leadership Principles

## Introduction

Leadership in the fire service requires...

## Key Principles

1. **Lead by Example**
   - Demonstrate the behaviors you expect
   - Maintain high standards
   - Show commitment to safety

2. **Communicate Effectively**
   - Clear, concise communication
   - Listen actively to your team
   - Provide regular feedback

3. **Make Informed Decisions**
   - Gather relevant information
   - Consider multiple perspectives
   - Take responsibility for outcomes

## Conclusion

Effective leadership is built on trust, competence, and dedication to the mission and the team.`
        },

        safety: {
            title: 'Safety Protocol',
            content: `# Safety Protocol

## Overview

Safety is our top priority in all operations...

## Procedures

### Before Operations
- [ ] Check all equipment
- [ ] Review safety procedures
- [ ] Verify team readiness
- [ ] Assess environmental conditions

### During Operations
- [ ] Maintain constant communication
- [ ] Follow established protocols
- [ ] Monitor team status
- [ ] Adapt to changing conditions

### After Operations
- [ ] Conduct safety debrief
- [ ] Document lessons learned
- [ ] Maintain equipment
- [ ] Review performance

## Emergency Procedures

In case of emergency situations, follow these critical steps...`
        },

        training: {
            title: 'Training Program',
            content: `# Training Program

## Objectives

This training program is designed to...

## Learning Outcomes

By the end of this training, participants will be able to:

1. **Knowledge**: Understand key concepts and principles
2. **Skills**: Demonstrate practical applications
3. **Application**: Apply learning to real-world scenarios

## Training Schedule

### Week 1: Fundamentals
### Week 2: Practical Application
### Week 3: Advanced Techniques
### Week 4: Assessment and Certification

## Assessment Criteria

Training effectiveness will be measured through...`
        }
    },

    // Advanced Configuration
    advanced: {
        enableConsoleLogging: true,   // Enable detailed console logs
        enableErrorReporting: false,  // Enable error reporting (future)
        enableAnalytics: false,       // Enable usage analytics (future)
        experimentalFeatures: false,  // Enable experimental features

        // Performance settings
        performance: {
            autoSaveDebounce: 1000,   // Debounce auto-save (ms)
            searchDebounce: 300,      // Debounce search (ms)
            lazyLoadImages: true,     // Lazy load images in editor
            maxImageSize: 5242880     // Max image size in bytes (5MB)
        }
    }
};

/**
 * Apply configuration to the editor
 * This function is called automatically when the config is loaded
 */
window.applyBlogEditorConfig = function(config = window.BLOG_EDITOR_CONFIG) {
    // Apply CSS custom properties for colors
    if (config.colors) {
        const root = document.documentElement;
        Object.entries(config.colors).forEach(([key, value]) => {
            const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--color-${cssVar}`, value);
        });
    }

    // Apply branding
    if (config.branding) {
        const brandTitle = document.querySelector('.brand-title');
        const brandSubtitle = document.querySelector('.brand-subtitle');

        if (brandTitle && config.branding.title) {
            brandTitle.textContent = config.branding.title;
        }

        if (brandSubtitle && config.branding.subtitle) {
            brandSubtitle.textContent = config.branding.subtitle;
        }

        if (config.branding.favicon) {
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) {
                favicon.href = config.branding.favicon;
            }
        }
    }

    // Store config globally for access by the editor
    window.ACTIVE_BLOG_CONFIG = config;
};

// Auto-apply configuration when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.applyBlogEditorConfig();
    });
} else {
    window.applyBlogEditorConfig();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.BLOG_EDITOR_CONFIG;
}