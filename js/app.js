
// Function that creates a random speed for the enemies.
var createRandomSpeed = function(min, max) {
    var min = Math.ceil(min),
        max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



/****         Sprite Class           ********
 **** The base class for all sprites ********
 **** Contains a render(), setPlacement(), **
 **** getPlacement() methods, as well as ****
 **** size, location, and sprite image src. *
 */
var Sprite = function(placement = [0, 0], size = [101, 171], speed = 0) {
    //The image/sprite for the sprites, this uses
    // a helper that is provided to easily load images
    this.sprite = '';
    this.pos = placement;
    this.size = size;
    this.speed = speed;
};

// Draw the enemy on the screen, required method for game
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.pos[0], this.pos[1]);
};

// Set the sprite character.
Sprite.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

// Return the size of the sprite.
Sprite.prototype.getSize = function(index = null) {
    if (index == null) {
        return this.size;
    } else {
        return this.size[index];
    }
};

// Return an array of the sprite's position.
Sprite.prototype.getPos = function(index = null) {
    if (index == null) {
        return this.pos;
    } else {
        return this.pos[index];
    }
};

// Return the sprite's speed.
Sprite.prototype.getSpeed = function() {
    return this.speed;
};

/**** ******Enemy Class *********************
 **** Inherits from Sprite Class ************
 **** Has it's own update(), randomSpeed(),
 **** and placement() methods. **************/
var Enemy = function(index) {
    this.placeIndex = index;
    Sprite.call(this, this.placement(), [80, 67], createRandomSpeed(50, 120));
};

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Take the length of time since last update and multiply by speed
    // Produce a steady speed throughout the length of the row.
    // When enemy spawns or respawns, the speed is to be randomized.
    if (this.pos[0] < canvasWidth) {
        this.pos[0] += this.speed * dt;
    } else {
        this.pos = this.placement();
        this.speed = this.setSpeed(40, 100);
    }
};


// Produces a random speed for the enemy
Enemy.prototype.setSpeed = function(min, max) {
    // Min is inclusive; while, max is exclusive.
    return createRandomSpeed(50, 120);
};

// Places the enemy onto the gameboard.
Enemy.prototype.placement = function() {
    var possibleRows = [60, 140, 231, 315, 400],
        xMax = 300,
        xMin = 100,
        yMax = 3,
        yMin = 0,
        i = 0,
        x, y;

    // Want to ensure that there is at least one enemy per row.
    // After, placement is to be random.
    if (this.placeIndex < possibleRows.length) {
        y = possibleRows[this.placeIndex]
        x = (Math.floor(Math.random() * (xMax - xMin)) + xMin) * -1;
        return [x, y];
    } else {
        y = possibleRows[(Math.floor(Math.random() * (yMax - yMin)) + yMin) * -1];
        x = (Math.floor(Math.random() * (xMax - xMin)) + xMin) * -1;
        return [x, y];
    }

};

/****          Player Class            ****
 **** This class controls the player by ***
 **** update() and handleInpup() methods.****/
var Player = function() {
    this.startingPosition = [20, 700];
    Sprite.call(this, this.startingPosition, [72, 50], 20);
};

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// Update the player.
Player.prototype.update = function() {
    currentPosition = this.pos;
    this.setSprite(selectedCharacter);
};

// Handles the input and checks for collisions with water.
Player.prototype.handleInput = function(movement) {
    direction = movement;

    switch (movement) {
        case 'left':
            this.pos[0] -= this.speed;
            break;
        case 'up':
            this.pos[1] -= this.speed;
            break;
        case 'right':
            this.pos[0] += this.speed;
            break;
        case 'down':
            this.pos[1] += this.speed;
            break;
        default:

    }

    if (checkWaterCollision()) {
        switch (movement) {
            case 'left':
                this.pos[0] += this.speed;
                break;
            case 'up':
                this.pos[1] += this.speed;
                break;
            case 'right':
                this.pos[0] -= this.speed;
                break;
            case 'down':
                this.pos[1] -= this.speed;
                break;
            default:

        }
    }
};

// Check the boundaries for the gameboard to prevent the player
// from going off.
Player.prototype.checkBoardCollision = function() {
    if (this.pos[0] < 0) {
        this.pos[0] = 0;
    } else if (this.pos[0] > 720) {
        this.pos[0] = 720;
    } else if (this.pos[1] < -10) {
        this.pos[1] = -10;
    } else if (this.pos[1] > 650) {
        this.pos[1] = 650;
    }
};

// Sets the players position with given coordinates.
Player.prototype.setPosition = function(pos) {
    this.pos = pos;
};

// Sets the players speed.
Player.prototype.setSpeed = function(speed) {
    this.speed = speed;
}

/*
             ***********SELECTOR CLASS************
    This class sets the place where the player needs to get to
    in order to advance.
*/
var Selector = function() {
    Sprite.call(this, this.startingPosition(), [45, 55], 0);
};

Selector.prototype = Object.create(Sprite.prototype);
Selector.prototype.constructor = Selector;

// Place the selector randomly on the first row.
Selector.prototype.startingPosition = function() {
    var x = (Math.floor(Math.random() * ((canvasWidth - 100) - 0)) + 0) * 1;
    return [x, 45];
};


// Instantiating objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i = 0; i < 7; i++) {
    var enemy = new Enemy(i);
    enemy.setSprite('images/enemy-bug.png');
    allEnemies.push(enemy);
};

var player = new Player();

var selector = new Selector();
selector.setSprite('images/Selector2.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
