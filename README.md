# 🛡 SafeIP

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-1.5.1-blue.svg?style=flat-square)](https://github.com/AhmadJeddi/SafeIP/releases/tag/v1.5.1)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?style=flat-square&logoColor=white)](https://ahmadjeddi.github.io/SafeIP/)

> A lightweight network security checker that verifies your current IP location before accessing sensitive online services.

SafeIP is a lightweight web application that compares your detected IP location with a user-selected country, helping you identify unexpected network location changes before accessing sensitive online services.

---

## ✨ Features

### 🌍 Network Security

- Detect public IP address and IP-based network information
- Compare detected and expected countries
- Display network security status
- Protect configured Quick Links based on validation results
- Copy and refresh current network information

### 🔎 Country Selection

- Searchable country selector
- Keyboard navigation
- Country flag, name, and ISO code display
- Persist selected country using LocalStorage

### 🔗 Quick Links

- Create and manage custom links
- Automatic favicon detection with fallback support
- Favicon preview when adding links
- Custom link colors
- Drag & drop reordering
- Touch-friendly interactions
- Responsive card layout with independent scrolling
- Client-side validation and duplicate URL detection

### 🎨 User Experience

- Dark / Light theme support
- Skeleton / Shimmer loading states
- Responsive design
- Subtle Safe / Warning / Danger visual patterns
- User-friendly validation feedback

### ⭐ PWA

- Installable on supported browsers and devices
- Standalone app display
- Service Worker support
- Static asset caching
- Offline application shell
- Offline state feedback
- PWA icons and manifest metadata
- Manual installation prompt when supported

---

## 🔐 Network Security Validation

SafeIP performs multiple checks before enabling protected Quick Links:

- ✅ Internet availability
- ✅ API response validity
- ✅ Country location match
- ✅ Protected link access

If required network information is unavailable, SafeIP reports the missing information instead of treating the network as unsafe.

---

## 🚀 How It Works

SafeIP follows this workflow:

```text
User selects expected country
            |
            ↓
SafeIP retrieves network information
            |
            ↓
IP location is analyzed
            |
            ↓
Country comparison is performed
            |
            ↓
Security status is determined
            |
            ↓
Quick Links access is updated
            |
            ↓
Security status is displayed
```

---

## 🖥️ Preview

<p align="center">
  <img src="assets/preview.gif" alt="SafeIP Demo" width="90%">
</p>

### 🟢 Safe Network

The detected IP country matches the selected country.

```text
Selected Country: Iran
Detected Country: Iran

Status:
Safe Network
```

---

### 🟡 Warning

Required network information is incomplete or unavailable.

```text
Network information is unavailable
```

---

### 🔴 Unsafe Network

The detected country does not match the selected country.

```text
Selected Country: Iran
Detected Country: Germany

Status:
Unsafe Network
```

---

## 🏗️ Project Structure

```text
SafeIP/
├── index.html
├── manifest.webmanifest
├── service-worker.js
│
├── assets/
│   ├── favicon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-192-maskable.png
│   ├── icon-512-maskable.png
│   └── preview.gif
│
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── api.js
│   ├── storage.js
│   ├── ui.js
│   ├── theme.js
│   ├── pwa.js
│   ├── validator.js
│   ├── countries.js
│   ├── quick-links-validator.js
│   └── config.js
│
├── README.md
├── project_structure.md
└── LICENSE
```

---

## ⚙️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Fetch API
- LocalStorage API
- Public IP Geolocation APIs
- CSS Variables
- CSS Animations
- Web App Manifest
- Service Worker API
- Cache API
- PWA browser APIs

---

## 🔌 API Services

SafeIP uses public IP and geolocation services with fallback support.

Current providers:

- GeoJS (Primary)
- IPWho (Fallback)
- IPify (Last fallback)

If a service fails or does not provide sufficient network information, SafeIP attempts to use an available fallback service.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/AhmadJeddi/SafeIP.git
cd SafeIP
```

Run the project using a local web server such as VS Code Live Server.

For PWA installation, serve SafeIP through HTTPS or a supported secure development environment such as localhost.

---

## 🔒 Privacy & Security

SafeIP does not intentionally persist your IP address in LocalStorage or other application storage.

SafeIP does not:

- Collect personal information
- Require account registration
- Use cookies
- Intentionally store your IP address persistently

Network information is retrieved from public IP geolocation services and used locally for security validation.

User preferences and Quick Links are stored locally in the browser using LocalStorage.

---

## 👨‍💻 Author

[**Ahmad JeddiZahed**](https://github.com/AhmadJeddi)

---

## ⭐ Contributing

Contributions are welcome!

If you have ideas, find a bug, or want to improve the project, feel free to open an issue or submit a pull request.

If you find this project useful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.
