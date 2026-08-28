# SafeIP Project Structure

```text
SafeIP/
│
├── index.html                         # Main application page
├── manifest.webmanifest               # PWA application manifest
├── service-worker.js                  # PWA caching and offline support
├── build.js                           # Production build script
├── package.json                       # Project metadata and build scripts
├── package-lock.json                  # Locked dependency versions
├── .gitignore                         # Git ignored files and folders
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions build and deployment workflow
│
├── assets/
│   ├── favicon.png                    # Browser favicon
│   ├── icon-192.png                   # PWA icon (192x192)
│   ├── icon-512.png                   # PWA icon (512x512)
│   ├── icon-192-maskable.png          # Maskable PWA icon (192x192)
│   ├── icon-512-maskable.png          # Maskable PWA icon (512x512)
│   └── preview.gif                    # Project demo animation
│
├── css/
│   ├── reset.css                      # Browser style normalization
│   ├── variables.css                  # Global design and theme variables
│   └── style.css                      # Main application styles
│
├── js/
│   ├── app.js                         # Application entry point and workflow control
│   ├── api.js                         # IP and network information services
│   ├── storage.js                     # LocalStorage management
│   ├── ui.js                          # UI rendering and user interactions
│   ├── theme.js                       # Dark / Light theme management
│   ├── pwa.js                         # PWA registration and installation logic
│   ├── validator.js                   # Network security validation
│   ├── countries.js                   # Country data and country search
│   ├── quick-links-validator.js       # Quick Links validation
│   └── config.js                      # Application configuration
│
├── README.md                          # Project documentation
├── project_structure.md               # Project architecture description
└── LICENSE                            # Open-source license
```

## Build Output

The `build/` directory is generated automatically by `npm run build` and is excluded from Git.

```text
build/
├── index.html                         # Minified production HTML
├── manifest.webmanifest               # Minified production manifest
├── service-worker.js                  # Minified production service worker
├── assets/
│   ├── favicon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-192-maskable.png
│   └── icon-512-maskable.png
├── css/
│   └── style.min.css                  # Bundled and minified CSS
└── js/
    └── app.min.js                     # Bundled and minified JavaScript
```

`node_modules/` and `.vscode/` are also excluded from Git through `.gitignore`.
