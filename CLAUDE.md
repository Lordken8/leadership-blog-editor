# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Blog Editor** - a simple, clean web application for creating and managing blog posts. Built with vanilla HTML, CSS, and JavaScript with no external dependencies.

## Architecture

The project consists of three main components:

### Core Files

1. **`index.html`** - Professional HTML5 structure with Quill.js rich text editor integration
2. **`css/styles.css`** - Modern CSS Grid layout with professional styling for leadership content
3. **`js/editor.js`** - Enhanced JavaScript application with LeadershipBlogEditor class and Quill.js

### Features

- **Post Management**: Create, save, and load blog posts
- **Auto-save**: Automatic saving as user types
- **Local Storage**: Browser-based persistence
- **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+N (new)
- **Responsive Design**: Works on desktop and mobile
- **Post Selection**: Modal interface for choosing saved posts
- **Notifications**: User feedback system

## Project Structure

```
blog-editor/
├── index.html          # Main application entry point
├── css/
│   └── styles.css      # Stylesheet with modern design
├── js/
│   └── app.js          # BlogEditor class and functionality
├── assets/             # Static assets (images, icons)
├── docs/               # Documentation
└── README.md           # Project documentation
```

## Development Notes

- **Pure Vanilla Web Technologies**: No build process or dependencies required
- **Modern JavaScript**: ES6+ classes and features
- **Local Storage API**: For persistent data storage
- **Responsive CSS Grid/Flexbox**: Modern layout techniques
- **Accessible Design**: Semantic HTML and keyboard navigation

## Key Components

### BlogEditor Class
- `newPost()` - Creates new blank post
- `savePost()` - Saves current post to localStorage
- `loadPost()` - Shows modal to select and load saved posts
- `autoSave()` - Automatic saving functionality
- `showNotification()` - User feedback system

### Storage Format
Posts are stored as JSON objects with:
- `id`: Unique identifier
- `title`: Post title
- `content`: Post content
- `timestamp`: Creation/save time

## Common Commands

### Development
```bash
# Start local development server
python -m http.server 8001

# Open in browser
start http://localhost:8001
```

### File Structure
- Edit `index.html` for structure changes
- Modify `css/styles.css` for styling updates
- Update `js/app.js` for functionality changes

## Design Principles

- **Minimalist Interface**: Clean, distraction-free writing environment
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Mobile-First**: Responsive design starting from mobile
- **Accessibility**: Keyboard shortcuts and semantic markup
- **Performance**: No external dependencies, optimized loading

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Local storage support required
- ES6+ JavaScript features used