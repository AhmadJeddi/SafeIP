# 🛡 SafeIP

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/AhmadJeddi/SafeIP)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A lightweight network security checker that helps users verify their current IP location before accessing sensitive accounts.

SafeIP is a simple web-based security tool designed to check whether the current network location matches the user's selected country before opening services such as LinkedIn.

The main goal of this project is to provide a quick security check against unexpected IP location changes.

---

## ✨ Features

* 🌍 Detect current IP address
* 📍 Detect network country and location information
* 🏳️ Select expected country manually
* 🔍 Compare detected country with selected country
* ✅ Show network safety status
* 🔒 Prevent login when the network does not match expectations
* 📋 Copy current IP address
* 🔄 Refresh network information
* 💾 Save user preferences using LocalStorage
* 📱 Responsive design

---

## 🚀 How It Works

SafeIP follows this workflow:

```
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
Security status is displayed
```

---

## 🖥️ Preview

SafeIP provides three main security states:

### 🟢 Safe Network

The detected IP country matches the selected country.

Example:

```
Selected Country: Iran
Detected Country: Iran

Status:
Safe Network
```

---

### 🟡 Warning

The network information is incomplete or unavailable.

Example:

```
Network information service temporarily unavailable
```

---

### 🔴 Unsafe Network

The detected country does not match the selected country.

Example:

```
Selected Country: Iran
Detected Country: Germany

Status:
Unsafe Network
```

---

## 🏗️ Project Structure

```
SafeIP/

├── index.html                 # Main application page
│
├── css/
│   ├── reset.css              # Browser style normalization
│   ├── variables.css          # Global design variables
│   └── style.css              # Application styling
│
├── js/
│   ├── app.js                 # Application entry point
│   ├── api.js                 # Network information service
│   ├── storage.js             # LocalStorage management
│   ├── ui.js                  # User interface controller
│   ├── validator.js           # Security validation logic
│   ├── countries.js           # Country database
│   └── config.js              # Application configuration
│
├── README.md
├── project_structure.md
└── LICENSE
```

---

## ⚙️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript (ES Modules)
* LocalStorage API
* Public IP Geolocation APIs

---

## 🔌 API Services

SafeIP uses multiple IP services with fallback support.

Current providers:

* GeoJS (Primary)
* IPWho (Fallback)
* IPify (Last fallback)

If one service fails, the application automatically tries another available service.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/AhmadJeddi/SafeIP.git
```

Open the project folder:

```bash
cd SafeIP
```

Run the project using a local server.

Example:

Using VS Code Live Server extension:

```
Open index.html → Run with Live Server
```

---

## 🔐 Security Notes

SafeIP itself does **not**:

* Store your IP address
* Collect personal information
* Require account registration
* Use cookies

Network information is retrieved directly from public IP geolocation services.
User preferences are stored locally in your browser using LocalStorage.

---

## 🔧 Future Improvements

Planned features:

* Better API reliability system
* Network history tracking
* VPN / Proxy detection
* Browser extension version
* More detailed security scoring
* Improved UI animations
* Dark / Light theme support

---

## 👨‍💻 Author

**Ahmad JeddiZahed**

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.
