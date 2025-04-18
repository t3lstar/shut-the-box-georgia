class ShutTheBox {
    constructor() {
        this.tiles = Array.from({ length: 12 }, (_, i) => i + 1);
        this.shutTiles = new Set();
        this.dice1 = document.getElementById('dice1');
        this.dice2 = document.getElementById('dice2');
        this.rollButton = document.getElementById('rollDice');
        this.undoButton = document.getElementById('undoMove');
        this.newGameButton = document.getElementById('newGame');
        this.scoreElement = document.getElementById('score');
        this.tilesContainer = document.getElementById('tiles');
        
        // Track selected tiles and their sum
        this.selectedTiles = new Set();
        this.selectedSum = 0;
        
        // Track moves for undo
        this.moveHistory = [];
        this.currentDiceRoll = null;
        
        this.initializeGame();
        this.setupEventListeners();
        this.initializeDice();
    }
    
    initializeGame() {
        // Create tiles
        this.tilesContainer.innerHTML = '';
        this.tiles.forEach(num => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = num;
            tile.dataset.value = num;
            this.tilesContainer.appendChild(tile);
        });
        
        // Reset game state
        this.shutTiles.clear();
        this.selectedTiles.clear();
        this.selectedSum = 0;
        this.moveHistory = [];
        this.currentDiceRoll = null;
        this.updateScore();
        this.rollButton.disabled = false;
        this.undoButton.disabled = true;
    }
    
    setupEventListeners() {
        this.rollButton.addEventListener('click', () => this.rollDice());
        this.newGameButton.addEventListener('click', () => this.initializeGame());
        this.undoButton.addEventListener('click', () => {
            console.log('Undo button clicked');
            this.undoLastMove();
        });
        
        this.tilesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tile') && !e.target.classList.contains('shut')) {
                this.handleTileClick(e.target);
            }
        });
    }
    
    initializeDice() {
        // Create faces for both dice
        this.createDiceFaces(this.dice1);
        this.createDiceFaces(this.dice2);
    }
    
    createDiceFaces(diceElement) {
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        faces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.className = `dice-face ${face}`;
            diceElement.appendChild(faceElement);
        });
    }
    
    rollDice() {
        // Disable the roll button during animation
        this.rollButton.disabled = true;
        
        // Add rolling class to both dice
        this.dice1.classList.add('rolling');
        this.dice2.classList.add('rolling');
        
        // Generate random rolls
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        
        // Store the current roll
        this.currentDiceRoll = { roll1, roll2, sum: roll1 + roll2 };
        
        // Wait for animation to complete before showing final values
        setTimeout(() => {
            // Remove rolling class
            this.dice1.classList.remove('rolling');
            this.dice2.classList.remove('rolling');
            
            // Update dice display
            this.updateDiceDisplay(roll1, roll2);
            
            // Reset selected tiles when rolling new dice
            this.selectedTiles.clear();
            this.selectedSum = 0;
            this.moveHistory = [];
            this.undoButton.disabled = true;
            this.updateSelectedTiles();
        }, 1000); // Match this with the animation duration
    }
    
    updateDiceDisplay(roll1, roll2) {
        // Update dice1
        this.updateDiceFace(this.dice1, roll1);
        // Update dice2
        this.updateDiceFace(this.dice2, roll2);
    }
    
    updateDiceFace(diceElement, value) {
        const dotPositions = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };
        
        // Update all faces with the same pattern
        const faces = diceElement.querySelectorAll('.dice-face');
        faces.forEach(face => {
            face.innerHTML = dotPositions[value].map(pos => 
                `<div class="dot" style="grid-area: ${Math.floor(pos/3) + 1} / ${(pos%3) + 1}"></div>`
            ).join('');
        });
        
        // Rotate dice to show the correct face
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',    // front
            2: 'rotateX(0deg) rotateY(-90deg)',  // right
            3: 'rotateX(-90deg) rotateY(0deg)',  // top
            4: 'rotateX(90deg) rotateY(0deg)',   // bottom
            5: 'rotateX(0deg) rotateY(90deg)',   // left
            6: 'rotateX(180deg) rotateY(0deg)'   // back
        };
        
        diceElement.style.transform = rotations[value];
    }
    
    handleTileClick(tile) {
        const value = parseInt(tile.dataset.value);
        const diceSum = this.getDiceSum();
        
        // If tile is already selected, deselect it
        if (this.selectedTiles.has(value)) {
            this.selectedTiles.delete(value);
            this.selectedSum -= value;
            tile.classList.remove('selected');
            this.moveHistory = this.moveHistory.filter(move => move !== value);
            this.undoButton.disabled = this.moveHistory.length === 0;
        } 
        // If tile can be selected (sum doesn't exceed dice roll)
        else if (this.selectedSum + value <= diceSum) {
            this.selectedTiles.add(value);
            this.selectedSum += value;
            tile.classList.add('selected');
            this.moveHistory.push(value);
            this.undoButton.disabled = false;
            
            // If sum equals dice roll, shut the selected tiles
            if (this.selectedSum === diceSum) {
                this.shutSelectedTiles();
            }
        }
        
        this.updateSelectedTiles();
    }
    
    undoLastMove() {
        console.log("Undo last move called, history length:", this.moveHistory.length);
        
        if (this.moveHistory.length === 0) {
            console.log("No moves to undo");
            return;
        }
        
        const lastValue = this.moveHistory.pop();
        console.log("Undoing tile:", lastValue);
        
        this.selectedTiles.delete(lastValue);
        this.selectedSum -= lastValue;
        
        const tile = this.tilesContainer.querySelector(`.tile[data-value="${lastValue}"]`);
        if (tile) {
            tile.classList.remove('selected');
        }
        
        this.undoButton.disabled = this.moveHistory.length === 0;
        this.updateSelectedTiles();
    }
    
    updateSelectedTiles() {
        // Update visual state of selected tiles
        const tiles = this.tilesContainer.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const value = parseInt(tile.dataset.value);
            if (this.selectedTiles.has(value)) {
                tile.classList.add('selected');
            } else if (!this.shutTiles.has(value)) {
                tile.classList.remove('selected');
            }
        });
    }
    
    shutSelectedTiles() {
        // Save the move to history before shutting tiles
        const shutMove = {
            tiles: Array.from(this.selectedTiles),
            diceRoll: this.currentDiceRoll
        };
        
        // Shut all selected tiles
        this.selectedTiles.forEach(value => {
            this.shutTiles.add(value);
            const tile = this.tilesContainer.querySelector(`.tile[data-value="${value}"]`);
            if (tile) {
                tile.classList.add('shut');
                tile.classList.remove('selected');
            }
        });
        
        // Reset selection
        this.selectedTiles.clear();
        this.selectedSum = 0;
        this.moveHistory = [];
        this.undoButton.disabled = true;
        
        // Update score
        this.updateScore();
        
        // Enable roll button
        this.rollButton.disabled = false;
        
        // Check for win
        if (this.shutTiles.size === this.tiles.length) {
            alert('Congratulations! You won!');
        }
    }
    
    getDiceSum() {
        const dice1Dots = this.dice1.querySelectorAll('.dot').length;
        const dice2Dots = this.dice2.querySelectorAll('.dot').length;
        return dice1Dots + dice2Dots;
    }
    
    updateScore() {
        const score = this.tiles.reduce((sum, num) => {
            return this.shutTiles.has(num) ? sum : sum + num;
        }, 0);
        this.scoreElement.textContent = score;
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new ShutTheBox();
}); 