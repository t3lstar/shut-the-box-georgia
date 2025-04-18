# Shut the Box Game

A web-based implementation of the classic "Shut the Box" dice game. This project uses Node.js, Express, and vanilla JavaScript to create an interactive game experience.

## Game Rules

"Shut the Box" is a classic dice game where players try to "shut" numbered tiles by rolling dice and using the sum to flip down number tiles. The goal is to shut all the tiles to win the game.

### How to Play

1. Click "Roll Dice" to roll the two dice
2. Click on a tile that matches the sum of the dice
3. If you can't match any tiles with the current roll, your turn is over
4. Try to shut all the tiles to win!
5. Click "New Game" at any time to start over

## Features

- 12 numbered tiles (1-12)
- Two realistic dice with proper dot patterns
- Clean, modern interface
- Score tracking
- New game button to reset
- Responsive design that works on both desktop and mobile

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/shut-the-box-georgia.git
   cd shut-the-box-georgia
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Game

### Production Mode
```
npm start
```

### Development Mode (with auto-restart)
```
npm run dev
```

Then open your browser and navigate to `http://localhost:3000`

## Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

```
shut-the-box-georgia/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── game.js         # Game logic
├── server.js           # Express server
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## License

ISC 