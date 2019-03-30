/**
 * Jeu Pang - Projet universitaire
 *
 * @author Fabian Devel, Nathanaël Houn, Valentin Perignon
 * @version 1.0
 */

// ------------------------------
//  Variables
// ------------------------------

/** Context */
var context = null;

/** Current level */
var numLevel = 1;

/**
 * Variables about game sate.
 * With focus, pause, victory and defeat
 */
var isOnFocus = true;
var pause = false;
var victory = false;
var defeat = false;

/** Timer (default value: 100sec) */
var timer = 100;

/** 
 * Array of all the balloons.
 * With center position (x and y), radius, velocity (x and y), and ballons gravity
 */
var balloons = [
    {center: {x: 400, y:30},
    radius:30,
    velocity:{ x: -1, y: 0},
    gravity: {x :0, y: 9.81/1000},
    },
    {center: {x: 500, y:30},
    radius:30,
    velocity:{ x: 1, y: 0},
    gravity: {x :0, y: 9.81/1000},
    }
];

/**
 * Balloons related variables.
 * With the speed
 */
const BALLOON_SPEED = 0.1;

/** Date of the last game update */
var lastUpdate = Date.now();

/**
 * The player.
 * With position (x and y), speed (x and y), height, width, power, shiel, score, lives number and color
 */
var player = {position: {x: 0, y: 0}, speed: {x: 0, y: 0}, height: 0, width: 0, powerOn: 1, shieldOn: 0, score: 0, livesNumber: 3, color: "blue"};
const PLAYER_SPEED = 500;
var isGravity = 0;

/**
 * Player related variables.
 * With gravity
 */
const GRAVITY = {x: 0, y: 1500};

/** 
 * Array of weapons.
 * With type (0: is not active), position, length and shooting
 */
var weapons = [
    {
        type:0,
        position: {x: 0, y: 0},
        length: 0,
        shooting: false,
    }
]

/**
 * Weapons related variables.
 * With speed, width, and weapon number
 */
    // - Hooks
const GRAPPLE_HOOK_NUMBER = 1 ;
const TRIDENT_NUMBER = 2 ;
const HOOK_SPEED = 0.3 ;
const HOOK_WITDH = 5;

    // - Others weapons
// HERE.

/** 
 * Array of all the platforms.
 * With position (x and y), width, height, height, exist and detructibility
 */
var platformsList = {
    level1 : [
        {
            "position":{
                "x": 575,
                "y": 200
            },
            "width": 120,
            "height": 400,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 460,
                "y": 200
            },
            "width": 80,
            "height": 40,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 275,
                "y": 200
            },
            "width": 80,
            "height": 40,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 125,
                "y": 400
            },
            "width": 80,
            "height": 40,
            "exist": true,
            "isDestructible": true
        }
    ],

    level2 : [
        {
            "position":{
                "x": 275,
                "y": 200
            },
            "width": 80,
            "height": 40,
            "exist": false,
            "isDestructible": false
        },
        {
            "position":{
                "x": 125,
                "y": 200
            },
            "width": 80,
            "height": 40,
            "exist": false,
            "isDestructible": true
        }
    ]
}
var platforms = platformsList.level1;


/** 
 * Array of all the ladders.
 * With position (x and y), width and height
 */
const LADDER_WIDTH = 90;
var laddersList = {
    "level1": [
        {
            "position":{
                "x": 35,
                "y": 400
            },
            "width": LADDER_WIDTH,
            "height": 200,
        }
    ]
};
var ladders = laddersList.level1;

/** Constants related graphics */
const DESTRUCTIBLE_PLATFORM_COLOR = "darkgrey";
const PLATFORM_COLOR = "black";
const LADDER_COLOR = "gray";
const BALLOON_COLOR = "red";
const GRAPPLE_HOOK_COLOR = "red";
const TRIDENT_COLOR = "orange"

// ------------------------------
//  Functions
// ------------------------------

/**
 * Move the player (horizontally).
 * @param {int} move - Key code
 */
playerMove = function(move) {
    switch (move) {
        case 39:
            player.speed.x = PLAYER_SPEED;
            break;
        case 37:
            player.speed.x = -PLAYER_SPEED;
            break;
    }
}

/**
 * Stop the player's movement (horizontally)
 * @param {int} move - Key code
 */
playerStopMove = function(move) {
    switch (move) {
        case 39:
            if(player.speed.x > 0) {
                player.speed.x = 0;
            }
            break;
        case 37:
            if(player.speed.x < 0) {
                player.speed.x = 0;
            }
            break;
    }
}

/**
 * Move the player (with ladders)
 * @param {int} move - Key code
 */
playerMoveLadder = function(move) {
    if(findLadder() != -1) {
        switch(move) {
            case 38:
                player.speed.y = -PLAYER_SPEED;
                break;
            case 40:
                player.speed.y = PLAYER_SPEED;
                break;
        }
    }
}

/**
 * Stop the player's movement (with ladders)
 */
playerStopMoveLadder = function() {
    player.speed.y = 0;
}

/**
 * Get the ladder array's index which is at the same player position
 * 
 * @returns {int} Array's index if the player is on a ladder, -1 if it's not the case
 */
findLadder = function() {
    var i=0;
    var find = false;

    while(i<ladders.length && !find) {
        if(player.position.x >= ladders[i].position.x - 0.33*player.width && player.position.x <= ladders[i].position.x + ladders[i].width - 0.66*player.width) {
            if(player.position.y >= ladders[i].position.y - 1.1*player.height && player.position.y <= context.height) {
                find = true;
            } else {
                i++;
            }
        } else {
            i++
        }
    }

    if(i == ladders.length) {
        i = -1;
    }
    return i;
}

/**
 * Detect if the player is on a platform
 * 
 * @returns {boolean} True if the player is on a platform
 */
detectPlatform = function() {
    var isOn = true;

    for(var i=0; i<platforms.length; i++) {
        if(!platforms[i].exist
        || player.position.x + player.width < platforms[i].position.x
        || player.position.x > platforms[i].position.x + platforms[i].width
        || player.position.y > platforms[i].position.y + platforms[i].height
        || player.position.y + player.height < platforms[i].position.y) {
            isOn = false;
        } else {
            isOn = true;
        }
    }

    return isOn;
}

/**
 * Detect if the player is neither on the ground, nor on a platform, nor on a ladder
 * 
 * @returns {boolean} True if the player is neither on the ground, nor on a platform, nor on a ladder 
 */
isNotOnPlatformOrGround = function() {
    isNot = false;

    if(player.position.y + player.height < context.height && findLadder() == -1 && !detectPlatform()) { // not on the ground
        isNot = true;
    }

    return isNot;
}

/**
 * Keep the player inside of the canvas
 */
function keepPlayerWithinBorder() {
    if(player.position.x < 0) {
        player.position.x = 0;
    } else {
        if(player.position.x > context.width-player.width) {
            player.position.x = context.width-player.width
        }
    }

    if(player.position.y < 0) {
        player.position.y = 0;
    } else {
        if(player.position.y > context.height-player.height) {
            player.position.y = context.height-player.height
        }
    }
}

/**
 * Keep balloons inside of the canvas
 */
function keepBalloonWithinBorders(ball){
    var changement = false;
    //Top
    if(ball.center.y < ball.radius){
        ball.center.y = ball.radius;
        ball.velocity.y = -ball.velocity.y;
        changement = true;
    } else {
        //Bottom
        if(ball.center.y > cvs.height - ball.radius){
            ball.center.y = cvs.height - ball.radius;
            ball.velocity.y = -ball.velocity.y;
            changement = true;
        }
    }
    //Left
    if(ball.center.x < ball.radius){
        ball.center.x = ball.radius;
        ball.velocity.x = -ball.velocity.x;
        changement = true;
    } else {
        //Right
        if(ball.center.x > cvs.width-ball.radius){
            ball.center.x = cvs.width - ball.radius;
            ball.velocity.x = -ball.velocity.x;
            changement = true;
        }
    }
    return(changement);
}


/**
 * Draw a circle
 * @param {object balloon} cirlce - Balloon which will be draw
 */
function fillCircle(circle){
    var canvas = document.getElementById("cvs");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle=BALLOON_COLOR;
    context.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
    context.fill();
}


/**
 * Detect the victory
 * (i.e. detect if no balloon remaining)
 * 
 * @returns {boolean} True if the player won
 */
function isVictory(){
    var isOneBalloonRemaining = false;
    var i=0
    while(i<balloons.length && !isOneBalloonRemaining){
        if(balloons[i].radius > 0){
            isOneBalloonRemaining = true;
        }
        i++;
    }
    return(!isOneBalloonRemaining);
}

/**
 * Detect the defeat 
 * (i.e. if there is no time and no ballon remaining)
 */
isDefeat = function() {
    var defeat = false;

    // check
    if(timer <= 1 && !isVictory()) {
        defeat = true;
    }

    return defeat;
}

/**
 * Detect if the weapon is on a rectangle (for x axis)
 * @param {object weapon} weapon - Player's weapon
 * @param {object rectangle} rectangle - An obstacle
 */
function isWeaponBetweenX(weapon,rectangle){
    return(weapon.position.x > rectangle.position.x && weapon.position.x + HOOK_WITDH < rectangle.position.x + rectangle.width);
}

/**
 * Fire a weapon
 * @param {object player} player - The player
 */
function shootWeapon(player){
    switch(player.powerOn){
        case GRAPPLE_HOOK_NUMBER:
            shootGrappleHook(weapons[0]);
            break;

        case TRIDENT_NUMBER:
            shootGrappleHook(weapons[0]);
            break;
    }
}

/**
 * Shoot a hook
 * @param {object weapon} grappleHook - The player's weapon (which is currently in use)
 */
function shootGrappleHook(grappleHook){
    if(grappleHook.type == 0) {
        grappleHook.type = player.powerOn;
        grappleHook.shooting = true;
        grappleHook.position = {x: player.position.x+player.width/2 , y: player.position.y+player.height};
        grappleHook.length = 0;
    }
}

/**
 * Delete the drawing of the weapon
 * @param {object weapon} weapon - The weapon which was fire
 */
function deleteWeapon(weapon){
    weapon.type = 0;
    weapon.shooting = false;
    weapon.position = {x:0, y:0};
    weapon.length = 0;
}

/**
 * Check if the hook should stop
 * @param {object weapon} hook - The player's weapon
 */
function stopHooks(hook){
    // Hit the top of the screen
    if(hook.position.y - hook.length < 0){
        switch(hook.type){
            case GRAPPLE_HOOK_NUMBER :
                deleteWeapon(hook);
                break;

            case TRIDENT_NUMBER :
                hook.shooting = false;
                break;
        }
    } else {

        //Hit a platform
        var isItHittingPlatform = false;

        for(var i=0 ; i<platforms.length ; i++){
            if(platforms[i].exist && isWeaponBetweenX(hook,platforms[i])){
                if(hook.position.y - hook.length  < platforms[i].position.y + platforms[i].height){
                    
                    switch(hook.type){
                        case GRAPPLE_HOOK_NUMBER :
                            deleteWeapon(hook);
                            if(platforms[i].isDestructible){
                                platforms[i].exist = false;
                            }
                            break;

                        case TRIDENT_NUMBER :
                            hook.shooting = false;
                            break;
                    }
                }
            }
        }
    }

    //Hitting a balloon
    for(var i=0 ; i<balloons.length ; i++){
        if(balloons[i].radius>0){

            if( Math.pow(balloons[i].center.x - hook.position.x, 2) < Math.pow(balloons[i].radius, 2) 
            && balloons[i].center.y + balloons[i].radius > hook.position.y - hook.length){

                deleteWeapon(hook);
                player.score += balloons[i].radius*10 ;
                balloons    [i].radius = 0;
            }
        }
    }

}

/**
 * Square disatnce bewteen two points
 * @param {object point} pointA - First point
 * @param {object point} pointB - Second point
 * 
 * @returns {float} The distance between A and B
 */
function squareDistanceBetweenPoints(pointA,pointB){
    return((pointA.x - pointB.x)*(pointA.x - pointB.x) + (pointA.y - pointB.y)*(pointA.y - pointB.y));
}

/**
 * Detect if the balloon is between the x and (x + width) of the rectangle
 * @param {object balloon} ball - The balloon
 * @param {object rectangle} rectangle - The rectangle
 * 
 * @returns {boolean} True if the balloon is between the x and (x + width) of the rectangle
 */
function isBalloonBetweenRectangleX(ball,rectangle){
    return(ball.center.x > rectangle.position.x && ball.center.x < rectangle.position.x + rectangle.width);
}

/**
 * Detect if the balloon is between the y and (y + height) of the rectangle
 * @param {object balloon} ball - The balloon
 * @param {object rectangle} rectangle - The rectangle
 * 
 * @returns {boolean} True if the balloon is between the y and (y + height) of the rectangle
 */
function isBalloonBetweenRectangleY(ball,rectangle){
    return(ball.center.y >= rectangle.position.y && ball.center.y <= rectangle.position.y + rectangle.height);
}

/**
 * Detect if the balloon is near a plateform
 * (i.e. near to collide but we don't know if it does)
 * 
 * @return {boolean} True if the balloon is near a plateform
 */
function isBalloonNearObject(ball,object){
    return(!(ball.center.x < object.position.x - ball.radius
    || ball.center.x > object.position.x + object.width + ball.radius
    || ball.center.y < object.position.y - ball.radius
    || ball.center.y > object.position.y + object.height + ball.radius))
}

/**
 * Detect  if the balloon touched the bottom or the upside of a rectangular object
 * (only for horizontal collisions)
 * @param {object balloon} ball - The balloon
 * @param {object *} object - A rectangular object
 * 
 * @returns {boolean} True if the balloon touched the bottom or the upside of a rectangular object
 */
function isInHorizontalCollision(ball, object){
    var collision = false;
    if(isBalloonBetweenRectangleX(ball, object)){
        if(ball.center.y >= object.position.y - ball.radius 
        && ball.center.y <= object.position.y + object.height + ball.radius){
            collision = true;
        }
    }
    return(collision);
}

/**
 * Detect  if the balloon touched the bottom or the upside of a rectangular object
 * (only for vertical collisions)
 * @param {object balloon} ball - The balloon
 * @param {object *} object - A rectangular object
 * 
 * @returns {boolean} True if the balloon touched the bottom or the upside of a rectangular object
 */
function isInVerticalCollision(ball, object){
    var collision = false;
    if(isBalloonBetweenRectangleY(ball, object)){
        if(ball.center.x >= object.position.x - ball.radius
        && ball.center.x <= object.position.x + object.width + ball.radius){
            collision = true;
        }
    }
    return(collision);
}

/**
 * Detect if the balloon is colliding with the bottom right corner 
 * @param {object balloon} ball - The balloon 
 * @param {object *} object - Any object
 * 
 * @returns {boolean} True if the balloon is colliding with the bottom right corner
 */
function isBalloonCollidingBottomRightCorner(ball,object){
    let bottomRightCorner = {x: object.position.x + object.width, y: object.position.y + object.height} ;
    return(squareDistanceBetweenPoints(ball.center,bottomRightCorner) <= ball.radius * ball.radius);
}

/**
 * Detect if the balloon is colliding with the top right corner 
 * @param {object balloon} ball - The balloon 
 * @param {object *} object - Any object
 * 
 * @returns {boolean} True if the balloon is colliding with the top right corner
 */
function isBalloonCollidingTopRightCorner(ball,object){
    let topRightCorner = {x: object.position.x + object.width, y: object.position.y} ;
    return(squareDistanceBetweenPoints(ball.center,topRightCorner) <= ball.radius * ball.radius);
}

/**
 * Detect if the balloon is colliding with the bottom left corner 
 * @param {object balloon} ball - The balloon 
 * @param {object *} object - Any object
 * 
 * @returns {boolean} True if the balloon is colliding with the bottom left corner
 */
function isBalloonCollidingBottomLeftCorner(ball,object){
    let bottomLeftCorner = {x: object.position.x, y: object.position.y + object.height} ;
    return(squareDistanceBetweenPoints(ball.center,bottomLeftCorner) <= ball.radius * ball.radius);
}

/**
 * Detect if the balloon is colliding with the top left corner 
 * @param {object balloon} ball - The balloon 
 * @param {object *} object - Any object
 * 
 * @returns {boolean} True if the balloon is colliding with the top left corner
 */
function isBalloonCollidingTopLeftCorner(ball,object){
    let topLeftCorner = {x: object.position.x, y: object.position.y} ;
    return(squareDistanceBetweenPoints(ball.center,topLeftCorner) <= ball.radius * ball.radius);
}

/**
 * Make sure the balloons are not colliding with rectangle objects like platforms
 * @param {object balloon} ball - The balloon
 * @param {object *} object - A rectangular object
 * 
 * @returns {float} The correction
 */
function keepBallonOutsideObjects(ball, object){
    if(object.exist){
        var correction = false;

        // Is the balloon near the object ? Simple and quick verification (optimize)
        if(isBalloonNearObject(ball,object)){
            
            // Collision with horizontal surfaces
            if(isInHorizontalCollision(ball,object)){
                ball.velocity.y *= -1;
                correction = true;

            // or collision with vertical surfaces
            } else if(isInVerticalCollision(ball,object)){
                ball.velocity.x *= -1;
                correction = true;

            // or in collision with angles
            } else {
                
                //Top left corner
                if(isBalloonCollidingTopLeftCorner(ball,object)){
                    correction = true;
                    // Equation of the angle straith line (@return y)
                    function equation(x){
                        return(-(x-object.position.x) + object.position.y);
                    }

                    // The balloon is in the vertical area
                    if(ball.center.y > equation(ball.center.x)){
                        ball.velocity.x *= -1;

                    // The balloon is in the horizontal area
                    } else {
                        ball.velocity.y *= -1;
                    }


                //Top right corner
                } else if(isBalloonCollidingTopRightCorner(ball,object)){
                    correction = true;
                    // Equation of the angle straith line (@return y)
                    function equation(x){
                        return((x-object.position.x-object.width) + object.position.y);
                    }

                    // The balloon is in the vertical area
                    if(ball.center.y > equation(ball.center.x)){
                        ball.velocity.x *= -1;

                    // The balloon is in the horizontal area
                    } else {
                        ball.velocity.y *= -1;
                    }

                // Bottom left corner
                } else if(isBalloonCollidingBottomLeftCorner(ball,object)){
                    correction = true;
                    // Equation of the angle straith line (@return y)
                    function equation(x){
                        return((x-object.position.x) + object.position.y + object.height);
                    }

                    // The balloon is in the vertical area
                    if(ball.center.y < equation(ball.center.x)){
                        ball.velocity.x *= -1;

                    // The balloon is in the horizontal area
                    } else {
                        ball.velocity.y *= -1;
                    }

                // Bottom right corner
                } else if(isBalloonCollidingBottomRightCorner(ball,object)){
                    correction = true;
                    // Equation of the angle straith line (@return y)
                    function equation(x){
                        return((x - object.position.x - object.width ) + object.position.y + object.height);
                    }

                    // The balloon is in the vertical area
                    if(ball.center.y < equation(ball.center.x)){
                        ball.velocity.x *= -1;

                    // The balloon is in the horizontal area
                    } else {
                        ball.velocity.y *= -1;
                    }
                }
            }
        }
    }
    return(correction);
}

/**
* Collision with any angles with the others functions
*/ 
function collisionsAngles(ball,object){
    return(isBalloonCollidingBottomLeftCorner(ball,object)
    || isBalloonCollidingBottomRightCorner(ball,object)
    || isBalloonCollidingTopLeftCorner(ball,object)
    || isBalloonCollidingTopRightCorner(ball,object));

}

/**
* Call the other testing functions and return if there's a collision
*/
function collisionsWithPlayer(ball, object){
    var collisionAngles = collisionsAngles(ball, object).collision;
    var collisionY = isInVerticalCollision(ball, object);
    var collisionX = isInHorizontalCollision(ball, object);
    return(collisionAngles || collisionX || collisionY);
}


/**
*
*/
function outputSpeed(ball){
    var speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
    console.log(speed);
}


// ------------------------------
//  Game
// ------------------------------

/**
* Initialization of the game
*/
init = function() {
    // Initizalisation of the global var context
    context = document.getElementById("cvs").getContext("2d");
    context.width = document.getElementById("cvs").width;
    context.height = document.getElementById("cvs").height;

    //Pause if it is not on focus
    document.body.onblur = function() {
        isOnFocus = false;
    }
    document.body.onfocus = function() {
        isOnFocus = true;
    }

    // 2 listeners on the keyboard (keyup and keydown)
    document.addEventListener("keydown", captureKeyboardPress)
    document.addEventListener("keyup", captureKeyboardReleased)

    // initialization of the player
    player.height = 75;
    player.width = 70;
    player.position.x = context.width/2 - player.width/2;
    player.position.y = context.height - player.height;

    // Go my little game loop, and never stop
    gameLoop();
}

/**
* Game loop
*/
gameLoop = function() {
    var delta = Date.now()-lastUpdate;
    lastUpdate = Date.now();

    // Run the game if it is not on pause
    if(!isOnFocus || pause){
        document.title = "Pang - en pause";
    } else {
        if(victory || defeat) {
            if(victory) {
                document.title = "Pang - gagné !";
            } else {
                document.title = "Pang - perdu...";
            }
            // draw the game
            render();
        } else {
            document.title = "Pang";

            // update of the game's state
            update(delta);
            // draw the game
            render();
        }
    }

    requestAnimationFrame(gameLoop);
}

/**
*  Game update
*  @param delta the time between now and the last update
*/
update = function(delta) {
    // update timer
    timer = timer - delta/1000;

    // Update balloons position 
    for(var i=0 ; i<balloons.length ; i++){
        if(balloons[i].radius>0){
            // Update balloons[i].velocity
            balloons[i].velocity.x += balloons[i].gravity.x*delta;
            balloons[i].velocity.y += balloons[i].gravity.y*delta;

            // Update balloons[i].center
            balloons[i].center.x += balloons[i].velocity.x * delta * BALLOON_SPEED;
            balloons[i].center.y += balloons[i].velocity.y * delta * BALLOON_SPEED;
        }
    }

    //Verifying that balloons do not crash into something
    for(var i=0 ; i < balloons.length ; i++){

        if(balloons[i].radius>0){    

            //Collisions with player
            if(collisionsWithPlayer(balloons[i], player)){
                pause = true;
            } else {
                //No, you will not stick out
                var bordersCorrection = keepBalloonWithinBorders(balloons[i]);

                if(!bordersCorrection){
                
                    //Don't go into platforms !
                    var correction = false;
                    var j=0 ;
                    while(j < platforms.length && !correction){
                        correction = keepBallonOutsideObjects(balloons[i], platforms[j]);
                        j++;
                    }
                }
            }
        }
    }



    // Weapons will deal a lot of damages
    for(var i=0 ; i<weapons.length ; i++){

        if(weapons[i].shooting==true){

            switch(weapons[i].type){

                case GRAPPLE_HOOK_NUMBER:
                case TRIDENT_NUMBER:
                    weapons[i].length += HOOK_SPEED * delta ;
                break;
            }
        }

        stopHooks(weapons[i]);
    }

    // New player's position
    var newPosXPlayer = player.position.x + player.speed.x*delta/1000, newPosYPlayer = player.position.y + player.speed.y*delta/1000
    var newSpdXPlayer = player.speed.x + isGravity*GRAVITY.x*delta/1000, newSpdYPlayer = player.speed.y + isGravity*GRAVITY.y*delta/1000;
    if(findLadder() != -1) {
        if(newPosYPlayer + player.height < ladders[findLadder()].position.y) {
            newPosYPlayer = ladders[findLadder()].position.y - player.height;
        }
    } else {
        if(newPosYPlayer < player.position.y) {
            newPosYPlayer = player.position.y;
        }
    }
    if(isNotOnPlatformOrGround()) {
        isGravity = 1;
    } else {
        isGravity = 0;
    }

    // Update player
    player.position.x = newPosXPlayer;
    player.position.y = newPosYPlayer;
    player.speed.x = newSpdXPlayer;
    player.speed.y = newSpdYPlayer;
    keepPlayerWithinBorder();

    //Detect the victory
    if(isVictory()){
        victory = true;
    }
    //Detect the defeat
    if(isDefeat()){
        defeat = true;
    }
}

/**
*  Game render
*/
render = function() {

    // Wiping the screen
    context.clearRect(0, 0, context.width, context.height);
    //context.drawImage(bg_paris, 0, 0, 800, 600);

    // Timer text
    var textTime = "TIME : ";
    if(Math.floor(timer) > 10 && Math.floor(timer) < 100) {
        textTime += "0";
    } else {
        if(Math.floor(timer) < 10) {
            textTime += "00";
        }
    }
    textTime += Math.floor(timer);
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 1.6;
    context.font = "bolder 30px Arial";
    context.fillText(textTime, 700 - 65, 40);
    context.strokeText(textTime, 700 - 65, 40);

    // platforms drawing
    for (var i=0; i < platforms.length; i++) {
        if(platforms[i].exist){
            if(platforms[i].isDestructible){
                context.fillStyle = DESTRUCTIBLE_PLATFORM_COLOR;
            } else {
                context.fillStyle = PLATFORM_COLOR ;
            }

            context.fillRect(platforms[i].position.x, platforms[i].position.y, platforms[i].width, platforms [i].height);
        }
    }

    // ladders drawing
    context.fillStyle= LADDER_COLOR ;
    for (var i=0; i < ladders.length; i++) {
        context.fillRect(ladders[i].position.x, ladders[i].position.y, ladders[i].width, ladders[i].height);
    }

    // balloons displaying
    for(var i=0 ; i<balloons.length ;i++){
        if(balloons[i].radius>0){
            fillCircle(balloons[i]);
        }
    }

    // weapons drawing
    for(var i=0 ; i < weapons.length ; i++){
        var weaponWidth = 0, weaponColor;
        switch(weapons[i].type){
            case GRAPPLE_HOOK_NUMBER :
                weaponColor = GRAPPLE_HOOK_COLOR;
                weaponWidth = HOOK_WITDH;
                break;

            case TRIDENT_NUMBER :
                weaponColor = TRIDENT_COLOR ;
                weaponWidth = HOOK_WITDH;
                break;
        }
        context.fillStyle = weaponColor;
        context.fillRect(weapons[i].position.x,weapons[i].position.y,weaponWidth,-weapons[i].length);
    }

    // Drawing of the player
    context.fillStyle = player.color;
    context.fillRect(player.position.x, player.position.y, player.width, player.height);

    // Victory and defeat screen
    if(victory){
        context.fillStyle = "green";
        context.fillRect(context.width/5,context.height/5,context.width/5*3,context.height/5*3);
        context.fillStyle = "black";
        context.font = '48px serif';
        context.textAlign = "center";
        context.fillText("Et c'est gagné !", cvs.width/2, cvs.height/2);
    } else {
        if(defeat) {
            context.fillStyle = "red";
            context.fillRect(cvs.width/5,cvs.height/5,cvs.width/5*3,cvs.height/5*3);
            context.fillStyle = "black";
            context.font = '48px serif';
            context.textAlign = "center";
            context.fillText("Et c'est perdu...", cvs.width/2, cvs.height/2);
        }
    }
}

/**
*  Key down event
*/
captureKeyboardPress = function(event) {
    switch (event.keyCode) {
        // Player1 left or right
        case 39:
        case 37:
            playerMove(event.keyCode);
            break;

        // Player1 up or down
        case 38:
        case 40:
            playerMoveLadder(event.keyCode);
            break;

        // 'P' means pause or unpause
        case 80:
            pause = !pause;
            break;

        // Space for fire the weapon
        case 32:
            shootWeapon(player);
            break;

        // Shortcut to victory                                                                       // BETA FUNCTION
        case 71:
            victory = !victory;
            break;

        // Shortcut to defeat                                                                       // BETA FUNCTION
        case 72:
            defeat = !defeat;
            break;

        //Activate the default weapon : the grapple hook                                            // BETA FUNCTION
        case 82:
            player.powerOn = GRAPPLE_HOOK_NUMBER ;
            console.log("Grappin activé");
            break;

        //Activate the powerOn Trident                                                              // BETA FUNCTION
        case 84:
            player.powerOn = TRIDENT_NUMBER ;
            console.log("Trident activé");
            break;
    }
}

/**
*  Key up event
*/
captureKeyboardReleased = function(event) {
    switch (event.keyCode) {
        //Player1 left or right
        case 39:
        case 37:
            playerStopMove(event.keyCode);
            break;
        case 38:
        case 40:
            playerStopMoveLadder();
            break;
    }
}