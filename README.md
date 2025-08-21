# 🎌 Anime Streaming Platform

A modern, responsive anime streaming platform that integrates with the Hi-anime API for seamless anime content delivery and user experience.

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Project Overview

This anime streaming platform provides users with a comprehensive viewing experience, featuring:
- **Seamless Streaming**: High-quality anime episodes with multiple server options
- **Modern UI/UX**: Responsive design with shared component library
- **API Integration**: Leverages Hi-anime API for extensive anime catalog
- **Search & Discovery**: Advanced search and filtering capabilities
- **User Experience**: Watchlists, progress tracking, and personalized recommendations

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with responsive design
- **JavaScript (ES6+)** - Interactive functionality
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for API requests

### External APIs
- **Hi-anime API** - Primary anime content source
- Base URL: `https://hianime.to`

## 📁 Project Structure

```
anime-streaming-platform/
├── 📂 frontend/                    # Frontend application
│   ├── index.html                  # Main HTML entry point
│   ├── styles/                     # CSS stylesheets
│   │   └── main.css               # Main stylesheet
│   └── js/                        # JavaScript modules
│       └── main.js                # Main application logic
│
├── 📂 backend/                     # Backend server
│   ├── server.js                   # Express server configuration
│   ├── routes/                     # API route handlers
│   ├── middleware/                 # Custom middleware
│   └── utils/                      # Utility functions
│
├── 📂 shared/                      # Shared resources
│   └── assets/                     # Shared UI assets
│       ├── styles/                 # Reusable component styles
│       │   └── components.css      # UI component library
│       ├── images/                 # Shared images and icons
│       └── fonts/                  # Custom fonts
│
├── 📄 README.md                    # Project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 .gitignore                   # Git ignore rules
└── 📄 package.json                 # Dependencies and scripts
```

## ✨ Core Features

### 🎭 Anime Discovery
- **Trending Anime**: Latest and most popular anime series
- **Advanced Search**: Search by title, genre, year, status
- **Filtering**: Sort by popularity, rating, release date
- **Categories**: Browse by genres, seasons, and demographics

### 📺 Streaming Experience
- **Multiple Sources**: Various streaming server options
- **Quality Selection**: Different video quality options
- **Episode Management**: Easy navigation between episodes
- **Resume Watching**: Continue from where you left off

### 👤 User Features
- **Watchlist Management**: Save anime for later viewing
- **Progress Tracking**: Automatic episode progress saving
- **Responsive Design**: Optimized for all device sizes
- **Fast Loading**: Optimized performance and caching

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Anime Discovery
```http
GET /trending
```
**Description**: Get trending anime series
**Response**: Array of trending anime objects

```http
GET /search?q={query}
```
**Description**: Search anime by title
**Parameters**: 
- `q` (required): Search query string
**Response**: Array of matching anime results

#### Anime Information
```http
GET /anime/:id
```
**Description**: Get detailed information about specific anime
**Parameters**:
- `id` (required): Anime identifier
**Response**: Anime details object with synopsis, ratings, etc.

```http
GET /anime/:id/episodes
```
**Description**: Get episode list for specific anime
**Parameters**:
- `id` (required): Anime identifier
**Response**: Array of episode objects

#### Streaming
```http
GET /watch/:episodeId
```
**Description**: Get streaming sources for specific episode
**Parameters**:
- `episodeId` (required): Episode identifier
**Response**: Object containing streaming source URLs

### Response Format
All API responses follow this structure:
```json
{
  "message": "Description of the operation",
  "data": [], // or {} depending on endpoint
  "error": "Error message if applicable"
}
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Darshil0305/anime-streaming-platform.git
   cd anime-streaming-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   cd backend
   node server.js
   ```

4. **Access the application**
   - Frontend: `http://localhost:5000`
   - API: `http://localhost:5000/api`

### Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
HI_ANIME_BASE_URL=https://hianime.to
NODE_ENV=development
```

## 💻 Development

### Frontend Development
- Located in `/frontend` directory
- Uses vanilla HTML, CSS, and JavaScript
- Shared components available in `/shared/assets`
- Responsive design with mobile-first approach

### Backend Development
- Express.js server in `/backend` directory
- RESTful API design
- CORS enabled for cross-origin requests
- Error handling middleware implemented

### Shared Resources
- Reusable UI components in `/shared/assets/styles/components.css`
- Includes: cards, buttons, modals, search inputs, loading states
- Responsive design utilities and media queries

## 🧪 Testing

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test trending anime endpoint
curl http://localhost:5000/api/trending

# Test search functionality
curl "http://localhost:5000/api/search?q=naruto"
```

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and structure
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: [GitHub](https://github.com/Darshil0305/anime-streaming-platform)
- **Issues**: [Report Bug](https://github.com/Darshil0305/anime-streaming-platform/issues)
- **API Source**: [Hi-anime](https://hianime.to)

## 🙏 Acknowledgments

- **Hi-anime API** for providing comprehensive anime data
- **Express.js** community for excellent documentation
- **Open source contributors** who help improve this project

---

<div align="center">
  <p>Built with ❤️ for anime enthusiasts worldwide</p>
  <p>© 2025 Anime Streaming Platform. All rights reserved.</p>
</div>
