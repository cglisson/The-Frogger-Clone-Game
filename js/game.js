// Global variables
var play = false,
    playerChosen = false,
    canvasWidth = 808,//505,
    canvasHeight = 800,//606;
    waterHeight = 60,
    waterWidth = 83,
    selectedCharacter,
    waterBlocks = [],
    currentPosition,
    waterBlockFilled = false,
    direction;

// Checks for collisions between the player and water blocks.
var checkWaterCollision = function() {
    var pS = player.getSize(),
        pCoord = player.getPos(),
        collided = false;

    waterBlocks.forEach(function(water) {
        if (pCoord[0] < water.x + waterWidth &&
            pCoord[0] + pS[0] > water.x &&
            pCoord[1] < water.y + waterHeight &&
            pCoord[1] + pS[1] + 35 > water.y) {
                collided = true;
        }

    });
    return collided;
};

// Check for enemy collisions. Return true for a collision, else return
// false for no collision.
var checkEnemyCollision = function() {
    var pX = player.getPos(0),
        pY = player.getPos(1),
        pW = player.getSize(0),
        pH = player.getSize(1);

    for (var i = 0; i < allEnemies.length; i++) {
        allEnemies[i]
        if (pX < allEnemies[i].getPos(0) + allEnemies[i].getSize(0) &&
            pX + pW > allEnemies[i].getPos(0) &&
            pY < allEnemies[i].getPos(1) + allEnemies[i].getSize(1) &&
            pY + pH > allEnemies[i].getPos(1)) {
                return true;
        }
    }
    return false;
};

// Inserts the water blocks into an array that will be used for
// checking collisions.
var populateWaterBlocks = function() {
    var layout = game.getLayout();

    for (var i = 0; i < layout.length; i++) {
        if (layout[i] instanceof Array) {
            var blocks = layout[i];
            for (var x = 0; x < blocks.length; x++) {
                if (blocks[x] === 'images/water-block.png') {
                    var rectangle = {
                        x: x * 101,
                        y: i * 83,
                        w: waterWidth,
                        h: waterHeight
                    };

                    waterBlocks.push(rectangle);
                }
            };
        }
    };
};

/*
                  ********Game class*********
    This class renders the layout of the gameboard based
    upon the level the player is on.  The player chooses
    their sprite of choice from the start menu.

*/
var Game = function(level = 0) {
    this.level = level;
    this.layout = this.layoutGenerator();
    this.waterPositions = [];
    this.gameWon = false;
    this.sprite = '';
};

// Generates a level for the game based upon the level the player is on.
Game.prototype.layoutGenerator = function () {
    var layouts = [
        [
            'images/grass-block.png', // level 1
            'images/stone-block.png',
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ],
        [

            'images/stone-block.png',   // Level 2
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/stone-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/stone-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            'images/stone-block.png',
            'images/stone-block.png',
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            'images/grass-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ],
        [
            'images/Dirt-Block.png',   // Level 3
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/brown-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            'images/Dirt-Block.png',
            [
                'images/water-block.png',
                'images/brown-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png'
            ],
            'images/Dirt-Block.png',
            [
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/brown-block.png',
                'images/water-block.png'
            ],
            'images/wood-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ]
    ];

    //populateWaterBlocks(layouts[this.level]);
    return layouts[this.level];
};

// Renders the gameboard.
Game.prototype.renderBoard = function() {
    var rowImages = game.getLayout(),
        numRows = 9,
        numCols = 8,
        row, col, rectangle;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid".
     */
    for (row = 0; row < numRows; row++) {
        //console.log('here again');
        if (rowImages[row] instanceof Array) {
            col = 0;
            for (block of rowImages[row]) {
                var xLocation = row * 83;
                var yLocation = col * 101;
                ctx.drawImage(Resources.get(block), yLocation, xLocation);

                col += 1;
            };
        } else {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                //console.log('here again again');
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            };
        }

    };
    this.score();
    waterBlockFilled = true;
};

// Creates a start menu before the game starts.
// The player chooses a sprite to use as their character.
Game.prototype.startMenu = function() {
    var mainText = "Welcome to Bugger: A Frogger Clone";
    var secondaryText = "The object is to get your player across the board.";

    $('#menu h1').text(mainText);
    $('#menu h2').text(secondaryText);
};

// Displays the leve the player is on.
Game.prototype.score = function() {
    var level = this.level + 1;

    $('.score').text('Level: ' + level);
};

// Creates a drop-down menu for choosing a character.
// Uses the ddSlick.js plugin.
Game.prototype.choosePlayer = function() {
    var ddlData = [
        {
            text: "Landon",
            value: 0,
            selected: false,
            description: "A quiet, idealistic boy who is interested in serving in humanity.  He is familiar with the dark side and embraces counterculture.",
            imageSrc: "images/char-boy.png"
        },
        {
            text: "Chaya",
            value: 1,
            selected: false,
            description: "She is an outgoing, open, and warm-hearted person who puts the needs of others over her own.  However, she is a finisher and particularly does not like strange things.",
            imageSrc: "images/char-cat-girl.png"
        },
        {
            text: "Molly",
            value: 2,
            selected: false,
            description: "Serious and sensitive, she likes to lead and is extremely loyal to her peers.  She is a risk taker and fearless and, therefore, very hard to discourage.",
            imageSrc: "images/char-pink-girl.png"
        }
    ];

    // selectData contains the selected text, value, description, and imageSrc
    $('#playerDropdown').ddslick({
        data: ddlData,
        width: 300,
        selectText: "Select your character",
        imagePosition: "left",
        onSelected: function(selectedData){
            play = true;
            selectedCharacter = selectedData.selectedData.imageSrc;
        }

    });
};

// Removes the Start Menu
Game.prototype.removeStartMenu = function() {
    $('#menu h1').text('');
    $('#menu h2').text('');
    $('#playerDropdown').text('');
    $('#menu h3').text('');
    $('.arrow').css('display', 'none');
    $('#menu').css('padding', '0px');
};

// Setup the Endgame menu
Game.prototype.endgameSetup = function(message) {
    $('.score').css('display', 'none');
    $('#game').css('display', 'none');
    $('.endgame_menu h1').text(message);
    $('.endgame_menu input').css('display', 'inline');
    $('.endgame_menu').css('display', 'inline');
}

// When the game is over, this method determines which end screen will be displayed.
Game.prototype.gameEnd = function() {
    if (this.gameWon) {
        // $('.score').css('display', 'none');
        // $('.endgame_menu h1').text('Congratulations, You Won!!!');
        // $('.endgame_menu input').css('display', 'inline');
        // $('.endgame_menu').css('display', 'inline');
        // $('#game').css('display', 'none');
        this.endgameSetup('Congratulations, you won!!!');
        $('.playAgain').on('click', function() {
            game.resetGame(); // may have to put a timeout setting
        });
    } else {
        // console.log('gameEnding');
        // $('.score').css('display', 'none');
        // $('#game').css('display', 'none');
        // $('.endgame_menu h1').text('Sorry, You Lost!!!');
        // $('.endgame_menu input').css('display', 'inline');
        // $('.endgame_menu').css('display', 'inline');
        this.endgameSetup('Sorry, you were killed. Please try again.');
        $('.playAgain').on('click', function() {
            game.resetGame(); // may have to put a timeout setting
        });
    }
};

// Resets the game when the player wants to play again.
Game.prototype.resetGame = function() {
    // Endgame menu
    $('.endgame_menu h1').text('');
    $('.playAgain').css('display', 'none');

    // Reset game variables
    this.level = 0;
    this.gameWon = false;
    waterBlockFilled = false;
    player.setPosition([100,700]);
    waterBlocks.splice(0, waterBlocks.length);

    // Regenerate the game board
    this.layout = this.layoutGenerator();
    populateWaterBlocks();

    // Display the board for play
    this.score();
    $('.score').css('display', 'inline');
    this.renderBoard();
    $('#game').css('display', 'inline');
};

// Updates the game if there is an outcome (advancing a level or if game over).
Game.prototype.update = function() {
    if (this.gameWon) {
        this.gameEnd();
    } else if (this.gameOutcome() == 'next') {
        this.level += 1;
        this.layout = this.layoutGenerator();
        waterBlocks.splice(0, waterBlocks.length);
        populateWaterBlocks();
        player.setPosition([100, 700]);
    } else if (this.gameOutcome() == 'died') {
        this.gameEnd();
    }
}

// Determines if the player has won or advanced to another level.
Game.prototype.gameOutcome = function() {
    var playerPosition = player.getPos(),
        playerSize = player.getSize(),
        selectorPosition = selector.getPos(),
        selectorSize = selector.getSize();
        
    if (playerPosition[0] < selectorPosition[0] + (selectorSize[1]) &&
        playerPosition[0] + playerSize[0] > selectorPosition[0] &&
        playerPosition[1] < selectorPosition[1] + selectorSize[1] - 40 &&
        playerPosition[1] + playerSize[1] > selectorPosition[1] - 40) {
            if (this.level >= 2) {
                this.gameWon = true;
            }else {
                return 'next';
            }
    }

    if (checkEnemyCollision()) {
        this.gameWon = false;
        return 'died';
    }

};

// Return the current layout of the game.
Game.prototype.getLayout = function() {
    return this.layout;
};

// Return the current game level.
Game.prototype.getLevel = function() {
    return this.level;
};

// Set the current game level.
Game.prototype.setLevel = function(level) {
    this.level = level;
};

// Returns the sprite.
Game.prototype.getSprite = function() {
    return this.sprite;
};

// Sets the sprite.
Game.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

// Initialize the game object.
var game = new Game(0);
