# DrawIt 🎨

DrawIt is a multiplayer drawing game where users compete by drawing on canvas based on prompts, with scores calculated by machine learning models. Players can create private rooms, compete in real-time, and track their performance through a comprehensive scoring system.

![Game Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18+-blue)

## ✨ Features

### 🏠 **Room Management System**
- **Create Private Rooms**: Generate unique room IDs with administrative privileges
- **Join Requests**: Players request to join rooms, room owners accept/deny requests
- **Real-time Management**: Live room status updates through Socket.io
- **Room Owner Controls**: Start games, manage players, delete rooms

### 🎮 **Multiplayer Drawing Game**
- **Real-time Canvas**: Collaborative drawing experience for all players
- **Shared Prompts**: All players receive the same drawing challenges
- **Live Leaderboard**: Real-time score tracking and rankings during gameplay
- **Progressive Difficulty**: Multiple levels with increasing complexity

### 🤖 **Machine Learning Scoring**
- **DoodleNet Classifier**: Drawings are evaluated by ml5's built-in DoodleNet sketch classifier
- **Client-Side Evaluation**: Classification runs in the browser via ml5/TensorFlow.js; the model's confidence for the target prompt becomes the score (0-100)
- **345 Quick, Draw! Categories**: Prompts and labels share the same category list, so classification maps directly to scoring
- **Shared Scorer**: The same classifier powers both solo practice and multiplayer modes

### 👤 **User Features**
- **JWT Authentication**: Secure user registration and login system
- **Profile Management**: Track game history and personal statistics
- **Practice Mode**: Solo drawing practice without competition
- **Game History**: View past games and monitor progress over time

### 🔧 **Technical Features**
- **Secure Caching**: Frontend and backend caching prevents data loss during network issues
- **Real-time Communication**: Socket.io for instant updates and multiplayer synchronization
- **Responsive Design**: Material-UI components for modern, adaptive interface
- **Scalable Architecture**: Clean separation of concerns with modular design

## 🛠️ Technology Stack

### Frontend (Client)
- **React.js 18.2.0** - Core UI framework with modern hooks and patterns
- **Redux Toolkit** - State management (minimal implementation)
- **Material-UI (MUI) 5.15.14** - Premium UI components and theming
- **React Router DOM 6.22.3** - Client-side routing and navigation
- **Socket.io Client 4.7.5** - Real-time bidirectional communication
- **Axios 1.6.8** - Promise-based HTTP client for API calls
- **Emotion** - CSS-in-JS styling solution for component-level styles
- **ml5 0.12.2** - DoodleNet sketch classifier for in-browser drawing evaluation

### Backend (Server)
- **Node.js with Express.js 4.21.0** - Web framework and API server
- **MongoDB with Mongoose 8.2.3** - NoSQL database and ODM
- **Socket.io 4.7.5** - Real-time socket communication and event handling
- **JWT 9.0.2** - JSON Web Token authentication and authorization
- **Multer 1.4.5** - File upload handling for potential drawing exports
- **CORS 2.8.5** - Cross-origin resource sharing configuration

### Development Tools
- **npm** - Package management and build scripts
- **Git** - Version control and collaboration
- **VSCode** - Recommended IDE with extensions support

### Infrastructure
- **Real-time Communication**: Socket.io server on port 5001
- **API Server**: Express.js backend on port 5000
- **Frontend**: React development server on port 3000
- **Database**: MongoDB at localhost:27017/drawit

## 📁 Project Structure

```
drawit/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── containers/        # Page-level components
│   │   │   ├── HomePage/      # Landing and navigation
│   │   │   ├── LoginPage/     # User authentication
│   │   │   ├── RegisterPage/  # User registration
│   │   │   ├── GamePage/      # Main game interface
│   │   │   ├── CreateRoomPage/# Room creation interface
│   │   │   ├── JoinRoomPage/  # Room joining interface
│   │   │   ├── PracticeDrawing/# Solo practice mode
│   │   │   ├── ProfilePage/   # User profile and stats
│   │   │   └── GameHistoryPage/# Historical game data
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Canvas/        # Drawing canvas component
│   │   │   ├── LeaderBoard/   # Score display component
│   │   │   └── Game/          # Game-related components
│   │   ├── api/              # API service layer
│   │   ├── redux/            # State management (minimal)
│   │   └── utils/            # Utility functions
│   └── .env                  # Frontend environment variables
├── server/                   # Node.js backend application
│   ├── src/
│   │   ├── models/           # MongoDB data models
│   │   ├── routes/           # API route definitions
│   │   ├── controllers/     # Business logic controllers
│   │   ├── socket/           # Socket.io event handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business service layer
│   │   └── config/           # Configuration files
│   └── .env                  # Backend environment variables
└── utils/                    # Shared utilities
    └── enum.js              # Constants and enums
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas connection)
- **Git** for version control

### Quick Start

1. **Clone the repository**
    ```bash
    git clone https://github.com/konetichandrakant/drawit.git
    cd drawit
    ```

2. **Install Dependencies**

    **Client (Frontend)**
    ```bash
    cd client
    npm install
    ```

    **Server (Backend)**
    ```bash
    cd ../server
    npm install
    ```

3. **Environment Setup**

    Create `.env` files in both `client/` and `server/` directories:

    **Server/.env**
    ```env
    PORT=5000
    SOCKET_PORT=5001
    MONGODB_URI=mongodb://localhost:27017/drawit
    JWT_SECRET=your_jwt_secret_key_here
    NODE_ENV=development
    ```

    **Client/.env**
    ```env
    REACT_APP_API_URL=http://localhost:5000
    REACT_APP_SOCKET_URL=http://localhost:5001
    ```

4. **Database Setup**
   - Ensure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update the `MONGODB_URI` in `server/.env` with your MongoDB Atlas connection string

## 🏃‍♂️ Running the Application

### Development Mode

**Start the Backend Server**
```bash
cd server
npm start
```
The server will start on:
- API Server: http://localhost:5000
- Socket.io Server: http://localhost:5001

**Start the Frontend Client** (in a separate terminal)
```bash
cd client
npm start
```
The React app will open at: http://localhost:3000

### Production Build

**Build the Frontend**
```bash
cd client
npm run build
```

**Start Production Server**
```bash
cd server
npm run prod
```

## 🎮 How to Play

1. **Register/Login**: Create an account or sign in to your existing account
2. **Create Room**: Generate a unique room ID and become the room owner
3. **Invite Players**: Share the room ID with friends or wait for join requests
4. **Start Game**: Once players have joined, the room owner can start the game
5. **Draw**: All players receive the same prompt and draw on their canvas
6. **Score**: The DoodleNet model rates how recognisably you drew the prompt
7. **Compete**: Watch the live leaderboard and see who wins!
8. **Practice**: Use practice mode to improve your drawing skills

### Game Flow
```
Authentication → Room Creation/Joining → Waiting Phase → Game Start → Drawing Phase → Scoring → Leaderboard → Game End
```

## 🔧 Development Guidelines

### Code Style
- Follow ESLint configuration for consistent code formatting
- Use meaningful variable and function names
- Write clear, concise comments for complex logic
- Keep components small and focused on single responsibilities

### Git Workflow
```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create pull request
git push origin feature/your-feature-name
```

### Environment Variables
Never commit `.env` files to version control. Use `.env.example` as a template for environment variables.

### Testing
Before submitting pull requests:
- Ensure all tests pass
- Test the application manually
- Check for console errors
- Verify responsive design

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
- Open an issue with detailed description
- Include steps to reproduce
- Add screenshots if applicable
- Specify your environment (OS, browser, Node.js version)

### 💡 **Feature Requests**
- Open an issue with the feature description
- Explain the use case and expected behavior
- Consider creating a design proposal

### 🔀 **Pull Requests**
1. Fork the repository
2. Create a feature branch from `master`
3. Make your changes with clear commit messages
4. Test your changes thoroughly
5. Submit a pull request with a descriptive title

### 🎨 **Areas for Contribution**
- **UI/UX**: Improve the user interface and experience
- **ML Models**: Enhance drawing evaluation algorithms
- **Game Features**: Add new game modes or features
- **Performance**: Optimize application performance
- **Documentation**: Improve code comments and documentation
- **Testing**: Add unit tests and integration tests

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 📜 License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ Liability and warranty disclaimed

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Material-UI** - For excellent React components
- **Socket.io** - For real-time communication capabilities
- **TensorFlow.js** - For machine learning in the browser
- **MongoDB** - For flexible database solutions

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/konetichandrakant/drawit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/konetichandrakant/drawit/discussions)
- **Author**: [Chandrakant Koneti](https://github.com/konetichandrakant)

---

⭐ If you find this project interesting, give it a star! ⭐
