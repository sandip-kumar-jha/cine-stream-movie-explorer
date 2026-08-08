# 🎬 Cine-Stream — Movie Explorer

Cine-Stream is a modern, responsive Single Page Application (SPA) built with React for discovering movies, searching movies, saving favorites, and getting AI-powered movie recommendations based on mood.

## 🚀 Live Demo 

## 📂 GitHub Repository

https://github.com/sandip-kumar-jha/cine-stream-movie-explorer

## ✨ Features

- 🎥 Popular movie discovery
- 🔎 Movie search
- ⏱️ 500ms debounced search
- ♾️ Infinite scrolling
- 👀 IntersectionObserver API
- ❤️ Add/remove favorites
- 💾 Favorites persistence using localStorage
- 🤖 AI-powered Mood Matcher
- 🖼️ Lazy-loaded movie posters
- 📱 Responsive design
- ⚠️ API error handling
- 🎬 Missing poster fallback
- 🧭 React Router navigation
- ⚛️ React Context API for favorites

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- JSX
- CSS
- React Router DOM

### APIs
- OMDb API
- Google Gemini API

### Browser APIs
- IntersectionObserver
- localStorage

### Tools
- Vite
- npm
- Git
- GitHub

## 📁 Project Structure

```text
cine-stream/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── ErrorMessage.jsx
│   │   ├── Loader.jsx
│   │   ├── MoodMatcher.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── context/
│   │   └── FavoritesContext.jsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   └── useInfiniteScroll.js
│   │
│   ├── pages/
│   │   ├── Favorites.jsx
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   ├── aiApi.js
│   │   └── omdbApi.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
