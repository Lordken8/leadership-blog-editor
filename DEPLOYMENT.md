# Deployment Guide - Leadership Blog Editor

Complete guide for deploying the Leadership Blog Editor to GitHub Pages and other platforms.

## 🚀 GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed locally
- Basic knowledge of Git commands

### Step 1: Repository Setup

1. **Create a new GitHub repository**:
   ```bash
   # Create repository on GitHub.com
   # Name: leadership-blog-editor (or your preferred name)
   # Description: Professional blog editor for leadership content
   # Public/Private: Your choice
   # Initialize with README: No (we'll add our own)
   ```

2. **Clone and setup locally**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/leadership-blog-editor.git
   cd leadership-blog-editor

   # Copy all blog editor files to this directory
   # Make sure you have:
   # - index.html
   # - embedded.html
   # - config.js
   # - css/styles.css
   # - js/editor.js
   # - README.md
   # - DEPLOYMENT.md (this file)
   ```

### Step 2: Prepare for GitHub Pages

1. **Create `.nojekyll` file** (important for GitHub Pages):
   ```bash
   touch .nojekyll
   ```
   This prevents GitHub from trying to process your files with Jekyll.

2. **Create `404.html`** (optional but recommended):
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Page Not Found - Leadership Blog Editor</title>
   </head>
   <body>
       <h1>Page Not Found</h1>
       <p><a href="/">Return to Leadership Blog Editor</a></p>
   </body>
   </html>
   ```

3. **Update `index.html` for production**:
   ```html
   <!-- Add this to the <head> section -->
   <base href="/leadership-blog-editor/">

   <!-- Update any relative paths if needed -->
   ```

### Step 3: Configure Repository

1. **Add and commit files**:
   ```bash
   git add .
   git commit -m "Initial commit: Leadership Blog Editor"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll to **Pages** section (left sidebar)
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Wait for deployment**:
   - GitHub will provide a URL: `https://YOUR_USERNAME.github.io/leadership-blog-editor/`
   - Deployment takes 5-10 minutes initially
   - Check the **Actions** tab to monitor deployment status

### Step 4: Custom Domain (Optional)

1. **Purchase a domain** (e.g., `leadership-editor.com`)

2. **Configure DNS**:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io

   Type: A
   Name: @
   Values:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. **Add CNAME file** to repository:
   ```bash
   echo "your-domain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

4. **Configure in GitHub**:
   - Go to repository **Settings** → **Pages**
   - Add your custom domain
   - Enable **Enforce HTTPS** (recommended)

## 🔧 Configuration for Production

### Environment-Specific Configurations

1. **Create `config.prod.js`** for production settings:
   ```javascript
   // Production configuration overrides
   window.BLOG_EDITOR_CONFIG_PROD = {
       branding: {
           title: 'Your Organization Blog Editor',
           subtitle: 'Professional Content Creation',
           logo: 'https://your-domain.com/logo.png'
       },

       colors: {
           primary: '#your-brand-color'
       },

       advanced: {
           enableConsoleLogging: false, // Disable in production
           enableAnalytics: true        // Enable if you have analytics
       }
   };

   // Merge with base config
   Object.assign(window.BLOG_EDITOR_CONFIG, window.BLOG_EDITOR_CONFIG_PROD);
   ```

2. **Update `index.html`** to load production config:
   ```html
   <script src="config.js"></script>
   <script src="config.prod.js"></script>
   ```

### Performance Optimizations

1. **Enable compression** in your web server:
   ```apache
   # .htaccess for Apache
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/plain
       AddOutputFilterByType DEFLATE text/html
       AddOutputFilterByType DEFLATE text/xml
       AddOutputFilterByType DEFLATE text/css
       AddOutputFilterByType DEFLATE application/xml
       AddOutputFilterByType DEFLATE application/xhtml+xml
       AddOutputFilterByType DEFLATE application/rss+xml
       AddOutputFilterByType DEFLATE application/javascript
       AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   ```

2. **Cache headers**:
   ```apache
   # Cache static assets
   <IfModule mod_expires.c>
       ExpiresActive on
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/png "access plus 1 year"
       ExpiresByType image/jpg "access plus 1 year"
       ExpiresByType image/jpeg "access plus 1 year"
   </IfModule>
   ```

## 📱 Embedded Deployment

### Using the Embedded Version

1. **Deploy `embedded.html`** to your web server

2. **Embed in any website**:
   ```html
   <iframe
       src="https://your-domain.com/embedded.html?minimal=true&toolbar=basic"
       width="100%"
       height="600px"
       frameborder="0">
   </iframe>
   ```

3. **Configuration via URL parameters**:
   ```html
   <!-- Minimal editor -->
   <iframe src="embedded.html?minimal=true&height=400px"></iframe>

   <!-- Custom branding -->
   <iframe src="embedded.html?brand=Your%20Editor&toolbar=basic"></iframe>

   <!-- Custom colors (URL encoded) -->
   <iframe src="embedded.html?primary=%23ff6b6b&secondary=%234ecdc4"></iframe>
   ```

### Advanced Embedding

1. **Parent-child communication**:
   ```javascript
   // Parent page JavaScript
   const iframe = document.getElementById('blog-editor');

   // Listen for content from editor
   window.addEventListener('message', (event) => {
       if (event.data.type === 'content') {
           console.log('Article content:', event.data.data);
       }
   });

   // Request content from editor
   iframe.contentWindow.postMessage({
       type: 'getContent'
   }, '*');

   // Set content in editor
   iframe.contentWindow.postMessage({
       type: 'setContent',
       title: 'Article Title',
       author: 'Author Name',
       htmlContent: '<p>Article content...</p>'
   }, '*');
   ```

## 🌐 Alternative Deployment Platforms

### Netlify Deployment

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: (leave empty)
   - Publish directory: (leave empty or use "/")
3. **Custom domain** configuration available
4. **Automatic SSL** included

### Vercel Deployment

1. **Import project** from GitHub
2. **Framework preset**: Other
3. **Build settings**: Default
4. **Custom domain** and SSL included

### Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize project**:
   ```bash
   firebase init hosting
   # Select your Firebase project
   # Public directory: . (current directory)
   # Single-page app: No
   # GitHub auto-deploy: Optional
   ```

3. **Deploy**:
   ```bash
   firebase deploy
   ```

## 📊 Analytics and Monitoring

### Google Analytics Integration

1. **Add to `index.html`**:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. **Track user actions**:
   ```javascript
   // Add to editor.js
   trackEvent(action, category = 'Editor') {
       if (typeof gtag !== 'undefined') {
           gtag('event', action, {
               event_category: category,
               event_label: this.getValue('articleTitle') || 'Untitled'
           });
       }
   }

   // Usage examples
   this.trackEvent('article_saved', 'Content');
   this.trackEvent('article_exported', 'Export');
   this.trackEvent('template_used', 'Templates');
   ```

### Error Monitoring

1. **Basic error tracking**:
   ```javascript
   window.addEventListener('error', (event) => {
       // Log to your error tracking service
       console.error('Application error:', event.error);

       // Optional: Send to error tracking service
       // sendErrorToService(event.error);
   });
   ```

## 🔐 Security Considerations

### Content Security Policy (CSP)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.quilljs.com;
    style-src 'self' 'unsafe-inline' https://cdn.quilljs.com https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self';
">
```

### HTTPS Enforcement

For custom domains, always enforce HTTPS:
```apache
# .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🛠 Maintenance and Updates

### Regular Updates

1. **Monthly checks**:
   - Update Quill.js CDN links if new versions available
   - Review and update dependencies
   - Test functionality across different browsers

2. **Version control**:
   ```bash
   # Create release tags
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **Backup strategy**:
   - Repository serves as primary backup
   - Consider additional backups for production data
   - Document configuration changes

### User Support

1. **Create support documentation**
2. **Set up issue tracking** (GitHub Issues)
3. **Monitor user feedback** and usage patterns
4. **Plan feature updates** based on user needs

## 📞 Troubleshooting

### Common Issues

1. **404 errors on GitHub Pages**:
   - Ensure `.nojekyll` file exists
   - Check file paths are correct
   - Verify repository is public (for free GitHub accounts)

2. **Quill.js not loading**:
   - Check CDN links are current
   - Verify internet connection for CDN access
   - Consider self-hosting Quill.js for reliability

3. **Configuration not applying**:
   - Ensure `config.js` loads before other scripts
   - Check browser console for JavaScript errors
   - Verify configuration object syntax

### Support Resources

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **Quill.js Documentation**: https://quilljs.com/docs/
- **MDN Web Docs**: https://developer.mozilla.org/

---

## 🎉 Congratulations!

Your Leadership Blog Editor is now deployed and ready for use. Users can access it at your GitHub Pages URL and start creating professional leadership content immediately.

For additional customization or support, refer to the main README.md file or create an issue in your repository.