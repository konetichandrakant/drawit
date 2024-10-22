# DrawIt

DrawIt is a game where users draw on a canvas and receive scores based on the accuracy and speed of their drawings, evaluated by a machine learning model and custom algorithm for scoring based on various parameters. Users can also compete with others by joining and playing in game rooms.

## Features

- Users can create and join rooms with various features available to the room creator, as well as additional functionalities for other participants.
- After joining a game room, all users receive the same drawing prompt, which is displayed at the top, and they can draw on the provided canvas.
- The game includes multiple levels with varying degrees of difficulty, providing a challenge for users as they progress.
- A live leaderboard is displayed to all players during the game, allowing them to compare their standings with others.
- User data is never lost, even in the event of network disruptions, thanks to secure caching systems on both the frontend and backend.
- Users receive a score after completing their drawings, calculated using machine learning models on the backend, which optimizes frontend performance by reducing bundle size.

## Technologies Used

- **Frontend**: React.js, Redux, Material-UI, HTML, CSS.
- **Backend**: Node.js, Express.js, JWT.
- **Database**: MongoDB, Server side caching.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/konetichandrakant/drawit.git
    ```

### Installing packages for client/frontend
1. Navigate to the project client directory:
    ```bash
    cd drawit/client
    ```
2. Install dependencies:
    ```bash
    npm i
    ```

### Installing packages for server/backend
1. Navigate to the project server directory:
    ```bash
    cd drawit/server
    ```
2. Install dependencies:
    ```bash
    npm i
    ```

## Running the Application

We should run the application using below steps after completing the installation.

### Starting client/frontend
1. Navigate to the project client directory:
    ```bash
    cd drawit/client
    ```
2. Starting the client/frontend:
    ```bash
    npm start
    ```

### Starting server/backend
1. Navigate to the project server directory:
    ```bash
    cd drawit/server
    ```
2. Starting the server/backend:
    ```bash
    npm start
    ```

## Contributing

Contributions are welcomed! Please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.