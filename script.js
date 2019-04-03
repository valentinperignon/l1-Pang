/**
 * Jeu Pang (Avril 2019)
 * script.js
 * 
 * @author Fabian Devel, Nathanaël Houn, Valentin Perignon
 */

// -------------------------------------------------------------------------------
// ################################ Game design ##################################
// -------------------------------------------------------------------------------

/** 
 * Array of all the platforms.
 * With position (x and y), width, height, height, exist and detructibility
 */
const PLATFORMS_LIST = {
    level1 : [],
    level2 : [
        {
            "position":{
                "x": 830,
                "y": 200
            },
            "width": 150,    
            "height": 30,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 635,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 490,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 350,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 100,
                "y": 200
            },
            "width": 150,
            "height": 30,
            "exist": true,
            "isDestructible": false
        }
    ],

    level3 : [
        //horizontal platforms
        {
            "position":{
                "x": 650,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 550,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 450,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": false
        },
        {
            "position":{
                "x": 350,
                "y": 200
            },
            "width": 80,
            "height": 30,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 700,
                "y": 500
            },
            "width": 100,
            "height": 100,
            "exist": true,
            "isDestructible": true
        },
        //vertical platforms
        {
            "position":{
                "x": 750,
                "y": 30
            },
            "width": 30,
            "height": 100,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 750,
                "y": 130
            },
            "width": 30,
            "height": 100,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 300,
                "y": 30
            },
            "width": 30,
            "height": 100,
            "exist": true,
            "isDestructible": true
        },
        {
            "position":{
                "x": 300,
                "y": 130
            },
            "width": 30,
            "height": 100,
            "exist": true,
            "isDestructible": true
        }
    ]
}

/** 
 * Array of all the ladders.
 * With position (x and y), width and height
 */
const LADDER_WIDTH = 90;
const LADDERS_LIST = {
    "level1": [],
    "level2": [],
    "level3": [
        {
            "position":{
                "x": 35,
                "y": 400
            },
            "width": LADDER_WIDTH,
            "height": 200,
        },
        {
            "position":{
                "x": 600,
                "y": 400
            },
            "width": LADDER_WIDTH,
            "height": 200,
        }
    ]
};

/**
 * List of size of balloons
 */
const BALLOON_SIZE = [
    {number: 0,
    radius: 0,
    Yvelocity:0
    },
    {number: 1,
    radius: 15,
    Yvelocity: -6
    },
    {number: 2,
    radius: 30,
    Yvelocity: -7
    },
    {number: 3,
    radius: 40,
    Yvelocity: -8
    },
    {number: 4,
    radius: 50,
    Yvelocity: -9.5
    }
]

/** 
 * Array of all the balloons.
 * With center position (x and y), radius, velocity (x and y), and ballons gravity
 */
const BALLOONS_LIST = {
	"level1": [
		{
			center: {x: 400, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: -1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		}
	],

	"level2": [
		{
			center: {x: 400, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: -1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		},
		{
			center: {x: 500, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: 1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		}
	],

	"level3": [
		{
			center: {x: 400, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: -1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		},
		{
			center: {x: 500, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: 1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		},
		{
			center: {x: 600, y:30},
			size: BALLOON_SIZE[4],
			velocity:{ x: 1, y: 0},
			gravity: {x :0, y: 9.81/1000},
		}
	]
}

// -------------------------------------------------------------------------------
// ################################ Variables ####################################
// -------------------------------------------------------------------------------

/** Context */
var context = null;

/** Level number */
var numLevel = 0;
const MAX_LEVEL = 3;

/**
 * Variables about game state.
 * With focus, pause, victory and defeat
 */
var isOnFocus = true;
var pause = false;
var victory = false;
var defeat = false;
var isInvincible = false;                                                                                           // BETA isInvicible

/** Timer */
var timer = 100;

/** An array of all the balloons in the game
 * With the position, the radius, the velocity, gravity and the color
 */
var balloons = [];

/** Balloons related variables */
const BALLOON_SPEED = 0.1;

/** Date of the last update */
var lastUpdate = Date.now();

/** A player
 * With his position (x and y), speed (x and y), height, width, power on, shield, lives number and color */
var player = {position: {x: 0, y: 0}, speed: {x: 0, y: 0}, height: 0, width: 0, powerOn: 0, shieldOn: 0, score: 0, livesNumber: 3, color: "blue"};
const PLAYER_SPEED = 500;
const GRAVITY = {x: 0, y: 1500};
var isGravity = 0;

/** 
 * Array of weapons.
 * With type (0: is not active), position, length and shooting
 */
var weapons = [] ;

/** Weapons related variables */
	// - Hooks
const GRAPPLE_HOOK_NUMBER = 1 ;
const DOUBLE_HOOK_NUMBER = 2 ;
const TRIDENT_NUMBER = 3 ;
const HOOK_SPEED = 0.3 ;
const HOOK_WITDH = 5;
	// - Others weapons
// ADD HERE

/** All the platforms */
var platforms = [] ;

/** Ladders in the game */
var ladders = [] ;


/**
 * Bonus items array
 */
var items = [];

/** Item related variables */
const GRAPPLE_HOOK_ITEM = GRAPPLE_HOOK_NUMBER; //1
const DOUBLE_HOOK_ITEM = DOUBLE_HOOK_NUMBER; //2
const TRIDENT_ITEM = TRIDENT_NUMBER; //3
const TIMER_BOOST_ITEM = 4;
const DYNAMITE_ITEM = 5;

const MAX_ITEM = 5;

/** Constants for the graphical part */
const DESTRUCTIBLE_PLATFORM_COLOR = "darkgrey";
const PLATFORM_COLOR = "black";
const LADDER_COLOR = "gray";
var BALLOON_COLOR;
var BALLON_GRADIENT;
const GRAPPLE_HOOK_COLOR = "red";
const TRIDENT_COLOR1 = "orangered";
const TRIDENT_COLOR2 = "orange";
const TRIDENT_COLOR3 = "yellow";
var BACKGROUND_IMAGE;

const GRAPPLE_HOOK_ITEM_COLOR = "red";
const DOUBLE_HOOK_ITEM_COLOR = "darkred";
const TRIDENT_ITEM_COLOR = "yellow";
const TIMER_BOOST_ITEM_COLOR = "plum";
const DYNAMYTE_COLOR = "seashell";

// ------------------------------------------------------------------------------------------------
// ######################################## Functions #############################################
// ------------------------------------------------------------------------------------------------

/**
* Level selection : initialize all the variables
*/
function levelInitialization(num){
    //JSON.parse(JSON.stringify(var)) is to make a copy of the object and not a copy of the adress.
    switch(num){
        case 2:
            ladders = JSON.parse(JSON.stringify(LADDERS_LIST.level2));
            platforms = JSON.parse(JSON.stringify(PLATFORMS_LIST.level2));
            balloons = JSON.parse(JSON.stringify(BALLOONS_LIST.level2));
			BALLOON_COLOR = "blue";
			BACKGROUND_IMAGE = citadelle;
        break;

        case 3:
            ladders = JSON.parse(JSON.stringify(LADDERS_LIST.level3));
            platforms = JSON.parse(JSON.stringify(PLATFORMS_LIST.level3));
            balloons = JSON.parse(JSON.stringify(BALLOONS_LIST.level3));
			BALLOON_COLOR = "green";
			BACKGROUND_IMAGE = fac;
        break;
            
        default:
            ladders = JSON.parse(JSON.stringify(LADDERS_LIST.level1));
            platforms = JSON.parse(JSON.stringify(PLATFORMS_LIST.level1));
            balloons = JSON.parse(JSON.stringify(BALLOONS_LIST.level1));
			BALLOON_COLOR = "red";
			BACKGROUND_IMAGE = fac;
    }

    // initialization of the player
    player.height = 75;
    player.width = 50;
    player.position.x = context.width/2 - player.width/2;
    player.position.y = context.height - player.height;
    player.powerOn = GRAPPLE_HOOK_NUMBER;

    //Initialisation of the timer
    timer = 100;

    //No weapon
    weapons = [];

    //No items
    items = [];
}

/**
 * Moving the player (horizontally)
 */
function playerMove(move) {
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
 */
function playerStopMove(move) {
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
 * Moving the player (with ladders)
 */
playerMoveLadder = function(move) {
    if(findLadder(player) != -1) {
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
function playerStopMoveLadder() {
	player.speed.y = 0;
}

/**
 * Return the ladder array's index
 */
function findLadder(object) {
    var i=0;
    var find = false;

    while(i<ladders.length && !find) {
        if(object.position.x >= ladders[i].position.x - 0.33*object.width && object.position.x <= ladders[i].position.x + ladders[i].width - 0.66*object.width) {
            if(object.position.y >= ladders[i].position.y - 1.1*object.height && object.position.y <= context.height) {
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
 */
function detectPlatform(object) {
    var isOn = true;

    for(var i=0; i<platforms.length; i++) {
        if(!platforms[i].exist
        || object.position.x + object.width < platforms[i].position.x
        || object.position.x > platforms[i].position.x + platforms[i].width
        || object.position.y > platforms[i].position.y + platforms[i].height
        || object.position.y + object.height < platforms[i].position.y) {
            isOn = false;
        } else {
            isOn = true;
        }
    }

    return isOn;
}

/**
 * Return true if the object is not on the ground, a platform, or a ladder
 */
function isNotOnPlatformOrGround(object){
    isNot = false;
    
    if(platforms.length == 0 || ladders.length == 0){
        return true;
    }
 
    if(object.position.y + object.height < context.height && findLadder(object) == -1 && !detectPlatform(object)) { // not on the ground
        isNot = true;
    }

	return(isNot);
}

/**
 * Draw a message in case of victory or defeat
 * @param {*} gameState - Game state, e.g. 'victory' or 'defeat'
 */
function drawFinalMessage(gameState) {
	var text;

	// rectangle
	if(gameState == 'victory') {
		context.fillStyle = 'rgb(51, 138, 52, .75)';
		text = "VICTOIRE !";
	} else {
		context.fillStyle = "rgb(171, 0, 13, .75)";
		text = "PERDU !";
	}
	context.shadowBlur = 15;
	context.shadowColor = 'black';
	context.fillRect(context.width/5, (context.height - 150)/2, context.width/5*3, 150);
	context.shadowBlur = 0;

	// text
	context.fillStyle = "white";
	context.font = '48px sans-serif';
	context.fillText(text, (context.width - context.measureText(text).width)/2, context.height/2 + 24);
}

/**
 * It does exactly what you expect
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
 * Checks if the player will collide with an object
 * @param {*} ball - The player
 * @param {float} newPosX - The (maybe) new X coordinate of the player
 * @param {float} newPosY - The (maybe) new Y coordinate of the player
 * @param {*} object - A rectangular object
 * 
 * @returns {boolean} True if the player will collide with the object
 */
function isPlayerWithinObject(player,newPosX,newPosY,object){
	var correction = false;
	if(object.exist){
		//
		if(newPosX + player.width < object.position.x || newPosX > object.position.x + object.width){
			//No problem
		} else {
			if(newPosY + player.height <= object.position.y || newPosY >= object.position.y + object.height){
				// No problem
			} else {
				correction = true;
			}
		}
	}
	return(correction);
}

/**
 * Keep balloons inside of the canvas
 * @param {*} ball - A balloon
 *
 * @returns {int} The changement
 */
function keepBalloonWithinBorders(ball){
	var changement = false;
	//Top
	if(ball.center.y < ball.size.radius){
		ball.center.y = ball.size.radius;
		ball.velocity.y = -ball.velocity.y;
		changement = true;
	} else {
		//Bottom
		if(ball.center.y > cvs.height - ball.size.radius){
			ball.center.y = cvs.height - ball.size.radius;
			ball.velocity.y = ball.size.Yvelocity;
			changement = true;
		}
	}
	//Left
	if(ball.center.x < ball.size.radius){
		ball.center.x = ball.size.radius;
		ball.velocity.x = -ball.velocity.x;
		changement = true;
	} else {
		//Right
		if(ball.center.x > cvs.width-ball.size.radius){
			ball.center.x = cvs.width - ball.size.radius;
			ball.velocity.x = -ball.velocity.x;
			changement = true;
		}
	}
	return(changement);
}

/**
 * Update the gradient of a circle
 * @param {*} circle - Balloon which will be update
 */
updateCircleColor = function(circle) {
	BALLON_GRADIENT = context.createRadialGradient(circle.center.x-circle.size.radius/3, circle.center.y-circle.size.radius/3, circle.size.radius/5, circle.center.x, circle.center.y, circle.size.radius);

	switch(BALLOON_COLOR) {
		case "blue":            
			BALLON_GRADIENT.addColorStop(0, '#5e92f3');
			BALLON_GRADIENT.addColorStop(.2, '#1565c0');
			BALLON_GRADIENT.addColorStop(1, '#003c8f');
			break;
		case "red":
			BALLON_GRADIENT.addColorStop(0, '#ff7961');
			BALLON_GRADIENT.addColorStop(.2, '#f44336');
			BALLON_GRADIENT.addColorStop(1, '#ab000d');
			break;
		case "green":
			BALLON_GRADIENT.addColorStop(0, '#76d275');
			BALLON_GRADIENT.addColorStop(.2, '#43a047');
			BALLON_GRADIENT.addColorStop(1, '#00701a');
	}
}

/**
 * Draw a circle
 * @param {*} circle - Balloon which will be draw
 */
function fillCircle(circle){
	updateCircleColor(circle);

	context.beginPath();
	context.fillStyle=BALLON_GRADIENT;
	context.arc(circle.center.x, circle.center.y, circle.size.radius, 0, 2 * Math.PI);
	context.fill();
}


/**
 * Detect the victory (= no balloon remaining)
 */
function isVictory(){
	var isOneBalloonRemaining = false;
	var i=0
	while(i<balloons.length && !isOneBalloonRemaining){
		if(balloons[i].size.number > 0){
			isOneBalloonRemaining = true;
		}
		i++;
	}
	return(!isOneBalloonRemaining);
}

/**
 * Detect the defeat 
 * (i.e. if there is no time and no ballon remaining)
 * returns {boolean} true if the defeat is real
 */
isDefeat = function(ball) {
	var defeat = false;

	// check
	if(timer <= 1 && !isVictory()) {
		defeat = true;
	} else if(ball.size.number > 0 && collisionsWithPlayer(ball, player) && !isInvincible){                                             // BETA IsInvicible
		defeat = true;    
	}
	return defeat;
}

// #####################################
// #### Shoot, manage and delete Weapons

/**
*
*/
function isWeaponBetweenX(weapon,rectangle){
	return(!(weapon.position.x + HOOK_WITDH < rectangle.position.x || weapon.position.x > rectangle.position.x + rectangle.width));
}

/**
* Fire a weapon
*/
function shootWeapon(player){
	switch(player.powerOn){
		case GRAPPLE_HOOK_NUMBER:
			shootGrappleHook();
			break;

		case DOUBLE_HOOK_NUMBER:
			shootGrappleHook();
			break;

		case TRIDENT_NUMBER:
			shootGrappleHook();
			break;
	}
}

/**
 * Shoot a hook
 */
function shootGrappleHook(){
    //No actual grapple hook shooted or double grapple hook bonus is on
    if(weapons.length==0 
    || (weapons.length < 2 && player.powerOn == DOUBLE_HOOK_NUMBER)){
        weapons[weapons.length] = {
            type: player.powerOn,
            shooting: true,
            position: {x: player.position.x+player.width/2 , y: player.position.y+player.height}, 
            length: player.height,
            time: 0    
        };
    }
}

/**
 * Delete the drawing of the weapon
 */
function deleteWeapon(){
	weapons = [];
}

/**
 * Delete a double hook that is on the top
 */
function deleteDoubleHook(){
	var temp = weapons.filter(weapons => weapons.shooting);
	weapons = temp;
}


/**
 * Checking if the hook should stop
 */
function stopHooks(hook){
    // Hit the top of the screen
    if(hook.position.y - hook.length < 0){
        switch(hook.type){
            case GRAPPLE_HOOK_NUMBER :
                deleteWeapon();
            break;

            case DOUBLE_HOOK_NUMBER:
                hook.shooting = false;
                deleteDoubleHook();
            break;                    

            case TRIDENT_NUMBER :
                hook.shooting = false;
                if(hook.time > 3){
                    deleteWeapon();
                }
            break;

            
        }
    } else {

        //Hit a platform
        var isItHittingPlatform = false;

        for(var i=0 ; i<platforms.length ; i++){
            if(platforms[i].exist && isWeaponBetweenX(hook,platforms[i])){
                if(hook.position.y - hook.length  < platforms[i].position.y + platforms[i].height && hook.position.y > platforms[i].position.y){
                    
                    switch(hook.type){
                        case GRAPPLE_HOOK_NUMBER :
                        case DOUBLE_HOOK_NUMBER :
                            hook.shooting = false;
                            deleteWeapon();
                            if(platforms[i].isDestructible){
                                platforms[i].exist = false;
                            }
                        break;

                        case TRIDENT_NUMBER :
                            hook.shooting = false;
                            if(platforms[i].isDestructible){
                                platforms[i].exist = false;
                                deleteWeapon(); 
                            }
                        break;
                    }
                }
            }
        }
    }

    //Hitting a balloon
    for(var i=0 ; i<balloons.length ; i++){
        if(balloons[i].size.number > 0){

            if( Math.pow(balloons[i].center.x - hook.position.x, 2) < Math.pow(balloons[i].size.radius, 2) 
            && balloons[i].center.y + balloons[i].size.radius > hook.position.y - hook.length
            && balloons[i].center.y + balloons[i].size.radius < hook.position.y){

                switch(hook.type){
                    case GRAPPLE_HOOK_NUMBER:
                    case TRIDENT_NUMBER:
                        deleteWeapon(hook);
                    break;

                    case DOUBLE_HOOK_NUMBER:
                        hook.shooting = false;
                        deleteDoubleHook();
                    break;
                }         

                //Points
                player.score += balloons[i].size.radius*10 ;
                
                //Two new balloons if the balloons is not of the minimal size
                
                if(balloons[i].size.number > 1){
                    var oldBall = balloons[i];

                    balloons[balloons.length] =  {
                        center: {x: oldBall.center.x, y: oldBall.center.y},
                        size: BALLOON_SIZE[oldBall.size.number - 1],
                        velocity:{ x: -1, y: -2},
                        gravity: {x :0, y: 9.81/1000}
                    };
                    
                
                    balloons[balloons.length] =  {
                        center: {x: oldBall.center.x, y: oldBall.center.y},
                        size: BALLOON_SIZE[oldBall.size.number - 1],
                        velocity:{ x: 1, y: -2},
                        gravity: {x :0, y: 9.81/1000}
                    };

                    //Maybe an item is spawning
                    if(Math.random()<1.20){
                        createItem(oldBall);
                    }


                }
                

                //Delete the balloon
                balloons[i].size = BALLOON_SIZE[0];
            }
        }
    }

}


// ######################################
// #### Balloons and platforms collisions

/**
*
*/
function squareDistanceBetweenPoints(pointA,pointB){
	return((pointA.x - pointB.x)*(pointA.x - pointB.x) + (pointA.y - pointB.y)*(pointA.y - pointB.y));
}


/**
* Is the balloonX between the x and (x + width) of the rectangle ? Return boolean
* Inputs : balloon with x, rectangle with x and width
*/
function isBalloonBetweenRectangleX(ball,rectangle){
	return(ball.center.x > rectangle.position.x && ball.center.x < rectangle.position.x + rectangle.width);
}

/**
* Is the ballon Y between the y and (y + width) of the rectangle ? Return boolean
* Inputs : balloon with y, rectangle with y and height
*/
function isBalloonBetweenRectangleY(ball,rectangle){
	return(ball.center.y >= rectangle.position.y && ball.center.y <= rectangle.position.y + rectangle.height);
}

/**
* Is the balloon near a plateform ? (= near to collide but we don't know if it does)
* @return true or false
*/
function isBalloonNearObject(ball,object){
	return(!(ball.center.x < object.position.x - ball.size.radius
	|| ball.center.x > object.position.x + object.width + ball.size.radius
	|| ball.center.y < object.position.y - ball.size.radius
	|| ball.center.y > object.position.y + object.height + ball.size.radius))
}

/**
* @return 'true' if the balloon touches the bottom or the upside of a rectangular object
*/
function isInHorizontalCollision(ball, object){
	var collision = false;
	if(isBalloonBetweenRectangleX(ball, object)){
		if(ball.center.y >= object.position.y - ball.size.radius 
		&& ball.center.y <= object.position.y + object.height + ball.size.radius){
			collision = true;
		}
	}
	return(collision);
}

/**
*@return 'true' if the balloon touches the left or the right of a rectangular object
*/
function isInVerticalCollision(ball, object){
	var collision = false;
	if(isBalloonBetweenRectangleY(ball, object)){
		if(ball.center.x >= object.position.x - ball.size.radius
		&& ball.center.x <= object.position.x + object.width + ball.size.radius){
			collision = true;
		}
	}
	return(collision);
}



/**
* Is the balloon colliding with the bottom right corner ?
* @return true is yes, else false
*/
function isBalloonCollidingBottomRightCorner(ball,object){
	let bottomRightCorner = {x: object.position.x + object.width, y: object.position.y + object.height} ;
	return(squareDistanceBetweenPoints(ball.center,bottomRightCorner) <= ball.size.radius * ball.size.radius);
}

/**
* Is the balloon colliding with the top right corner ?
* @return true is yes, else false
*/
function isBalloonCollidingTopRightCorner(ball,object){
	let topRightCorner = {x: object.position.x + object.width, y: object.position.y} ;
	return(squareDistanceBetweenPoints(ball.center,topRightCorner) <= ball.size.radius * ball.size.radius);
}

/**
* Is the balloon colliding with the top left corner ?
* @return true is yes, else false
*/
function isBalloonCollidingTopLeftCorner(ball,object){
	let topLeftCorner = {x: object.position.x, y: object.position.y} ;
	return(squareDistanceBetweenPoints(ball.center,topLeftCorner) <= ball.size.radius * ball.size.radius);
}

/**
* Is the balloon colliding with the top right corner ?
* @return true is yes, else false
*/
function isBalloonCollidingBottomLeftCorner(ball,object){
	let bottomLeftCorner = {x: object.position.x, y: object.position.y + object.height} ;
	return(squareDistanceBetweenPoints(ball.center,bottomLeftCorner) <= ball.size.radius * ball.size.radius);
}

/**
 * Make sure the balloons are not colliding with rectangle objects like platforms
 * @param {*} ball - The balloon
 * @param {*} object - A rectangular object
 * 
 * @returns {boolean} True if the balloon collided with the object
 */
function keepBalloonOutsideObjects(ball, object){
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
 * Create a random item when splitting a balloon
 * @param {*} ball the splitted balloon
 */
function createItem(ball){
    if(ball.size.number>0){
        items[items.length] = {
            type: Math.floor(Math.random()*MAX_ITEM)+1,
            position: {x: ball.center.x, y:ball.center.y},
            height: 20,
            width: 20,
            time: 0
        }
    }
}


/** 
 * Update the player powerOn if he touch an item
 */
function playerTouchItem(){
    for(var i = 0 ; i < items.length ; i++){
        if(items[i].type != -1){
            if((items[i].position.x > player.position.x && items[i].position.x < player.position.x + player.width)  
            || (items[i].position.x + items[i].width > player.position.x && items[i].position.x + items[i].width < player.position.x + player.width)){

                if((items[i].position.y > player.position.y && items[i].position.y < player.position.y + player.height)  
                || (items[i].position.y + items[i].height > player.position.y && items[i].position.y + items[i].height < player.position.y + player.height)){
                    
                    switch(items[i].type){

                        case GRAPPLE_HOOK_ITEM:
                        case DOUBLE_HOOK_ITEM_COLOR:
                        case TRIDENT_ITEM:
                            player.powerOn = items[i].type;
                            items[i].type = -1;
                        break;

                        case TIMER_BOOST_ITEM:
                            timer += 10;
                            items[i].type = -1;
                        break;

                        case DYNAMITE_ITEM:
                            dynamiteExplode();
                            items[i].type = -1;
                        break;
                    }
                }
            }
        }
    }
}


/**
 * Dynamite item : boooom
 */
function dynamiteExplode(){
    var bigBalloonRemaining = true;
    
    while(bigBalloonRemaining){
        bigBalloonRemaining = false;
        for(var i=0 ; i<balloons.length ; i++){

            if(balloons[i].size.number > 1){            
                var oldBall = balloons[i];

                balloons[balloons.length] =  {
                    center: {x: oldBall.center.x-3, y: oldBall.center.y},
                    size: BALLOON_SIZE[oldBall.size.number - 1],
                    velocity:{ x: -1, y: -2 + Math.random()},
                    gravity: {x :0, y: 9.81/1000}
                };
                
            
                balloons[balloons.length] =  {
                    center: {x: oldBall.center.x+3, y: oldBall.center.y},
                    size: BALLOON_SIZE[oldBall.size.number - 1],
                    velocity:{ x: 1, y: -2 + Math.random()},
                    gravity: {x :0, y: 9.81/1000}
                };

                balloons[i].size = BALLOON_SIZE[0];

                bigBalloonRemaining = true;
            }
        }
    }
}


// ------------------------------------------------------------------------------------------------
// ########################################## Game  ###############################################
// ------------------------------------------------------------------------------------------------

/**
* Initialization of the game
*/
init = function() {
	// Initizalisation of the global var context
	context = document.getElementById("cvs").getContext("2d");
	context.width = document.getElementById("cvs").width;
	context.height = document.getElementById("cvs").height;

	// initialization with level
	levelInitialization(1);

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
    timer -= delta/1000;

    // Update balloons position 
    for(var i=0 ; i<balloons.length ; i++){
        if(balloons[i].size.number > 0){
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

        if(balloons[i].size.number > 0){    
            //No, you will not stick out
            var bordersCorrection = keepBalloonWithinBorders(balloons[i]);
            if(!bordersCorrection){    
                //Don't go into platforms !
                var correction = false;
                var j=0 ;
                while(j < platforms.length && !correction){
                    correction = keepBalloonOutsideObjects(balloons[i], platforms[j]);
                    j++;
                }
            }
        }
    }

    // Weapons will deal a lot of damages
    for(var i=0 ; i<weapons.length ; i++){

        // Weapon is going up
        if(weapons[i].shooting==true){

            switch(weapons[i].type){

                case GRAPPLE_HOOK_NUMBER:
                case DOUBLE_HOOK_NUMBER:
                case TRIDENT_NUMBER:
                    weapons[i].length += HOOK_SPEED * delta ;
                break;
            }
        } else {

            //Increase the timer of the trident
            if(weapons[i].type == TRIDENT_NUMBER){
                weapons[i].time += delta/1000;
            }
        }

        stopHooks(weapons[i]);
    }

    // Items are falling and olding
    for(var i=0 ; i < items.length ; i++){
        if(items[i].type != -1 && isNotOnPlatformOrGround(items[i]) && items[i].position.y + items[i].height < cvs.height){
            items[i].position.y =items[i].position.y + GRAVITY.y*delta/10000;
        } else {
            items[i].time += delta/1000;
            
            if(items[i].time > 3 ){
                items[i].type = -1;
            }
        }
    }

    // New player's position
    var newPosXPlayer = player.position.x + player.speed.x*delta/1000, newPosYPlayer = player.position.y + player.speed.y*delta/1000
    var newSpdXPlayer = player.speed.x + isGravity*GRAVITY.x*delta/1000, newSpdYPlayer = player.speed.y + isGravity*GRAVITY.y*delta/1000;
    if(findLadder(player) != -1) {
        if(newPosYPlayer + player.height < ladders[findLadder(player)].position.y) {
            newPosYPlayer = ladders[findLadder(player)].position.y - player.height;
        }
    } else {
        if(newPosYPlayer < player.position.y) {
            newPosYPlayer = player.position.y;
        }
    }
    if(isNotOnPlatformOrGround(player)) {
        isGravity = 1;
    } else {
        isGravity = 0;
    }

    var willCollide = false;
    var obstacleNumber = -1;
    for(var i=0 ; i<platforms.length ; i++){
        if(isPlayerWithinObject(player,newPosXPlayer,newPosYPlayer,platforms[i])){
            willCollide = true;
            obstacleNumber = i;
        }
    }

    if(willCollide){
        //Vertical
        if(newSpdYPlayer < 0 && platforms[obstacleNumber].position.y + platforms[obstacleNumber].height <= player.position.y){
            newPosYPlayer = platforms[obstacleNumber].position.y + platforms[obstacleNumber].height;
            newSpdYPlayer = 0
        }  else {
            //Horizontal
            if(newSpdXPlayer>0){
                newPosXPlayer = platforms[obstacleNumber].position.x - player.width;    
            } else if(newSpdXPlayer<0){
                newPosXPlayer = platforms[obstacleNumber].position.x + platforms[obstacleNumber].width;
            }
            newSpdXPlayer = player.speed.x;
        }
    }

    // Update player
    player.position.x = newPosXPlayer;
    player.position.y = newPosYPlayer;
    player.speed.x = newSpdXPlayer;
    player.speed.y = newSpdYPlayer;
    keepPlayerWithinBorder();

    // Yeah an item
    playerTouchItem();

    //Detect the victory
    if(isVictory()){
        victory = true;
    }
    //Detect the defeat
    for(var i=0 ; i<balloons.length ; i++){
        if(isDefeat(balloons[i])){
            defeat = true;
        }
    }
}

/**
*  Game render
*/
render = function() {
	if(numLevel == 0) { 
        
        // ---------------
		// MENU
		// ---------------

		// variables d'affichage
		var textCopyright = "© Fabian D., Nathanaël H., Valentin P.";
		var textPlay = "ENTRÉE POUR COMMENCER ...";
		var textLevel = "OU SAISISSEZ LE NIVEAU";

		// fond noir
		context.fillStyle = "black";
		context.fillRect(0, 0, context.width, context.height);

		// affichage du logo Pang
		context.drawImage(logo, (context.width-400)/2, 80, 400, 189);

		// affichage du texte "copyright"
		context.fillStyle = "white";
		context.font = "17px Georgia";
		context.fillText(textCopyright, (context.width - context.measureText(textCopyright).width)/2, 189+80+20);

		// affichage du texte "Commencer à jouer..."
		context.fillStyle = "white";
		context.font = "35px Georgia";
		context.fillText(textPlay, (context.width - context.measureText(textPlay).width)/2, context.height-110-50);
		context.font = "25px Georgia";
		context.fillText(textLevel, (context.width - context.measureText(textLevel).width)/2, context.height-70-50);
	} else {
        
        // ---------------
		// GAME
		// ---------------

		// Wiping the screen
		//context.clearRect(0, 0, context.width, context.height);
		context.drawImage(BACKGROUND_IMAGE, 0, 0, 1080, 608);

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
		context.fillText(textTime, context.width - context.measureText(textTime).width - 20, 40);
		context.strokeText(textTime, context.width - context.measureText(textTime).width - 20, 40);

		// Score text
		var textScore = "SCORE : " + player.score;
		context.lineWidth = 1.3;
		context.font = "bolder 23px Arial";
		context.fillText(textScore, 20, 30);
		context.strokeText(textScore, 20, 30);

		// Lives text
		var textLives = "LIVES : ";
		if(player.livesNumber > 0) {
			for(var i=0; i<player.livesNumber; i++) {
				textLives += "I";
			}
		} else {
			textLives += "0";
		}
		context.fillText(textLives, 20, 57);
		context.strokeText(textLives, 20, 57);

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
			if(balloons[i].size.number > 0){
				fillCircle(balloons[i]);
			}
        }
        
        // items displaying
        for(var i=0 ; i<items.length ; i++){
            
            if(items[i].type !=-1){
                switch(items[i].type){
                    case GRAPPLE_HOOK_ITEM:
                        context.fillStyle = GRAPPLE_HOOK_ITEM_COLOR;
                    break;

                    case DOUBLE_HOOK_ITEM:
                        context.fillStyle = DOUBLE_HOOK_ITEM_COLOR;
                    break;

                    case TRIDENT_ITEM:
                        context.fillStyle = TRIDENT_ITEM_COLOR;
                    break;

                    case TIMER_BOOST_ITEM:
                        context.fillStyle = TIMER_BOOST_ITEM_COLOR;
                    break;

                    case DYNAMITE_ITEM:
                        context.fillStyle = DYNAMYTE_COLOR;
                    break;
                }
                context.fillRect(items[i].position.x, items[i].position.y, items[i].width, items[i].height);
            }
        }


		// weapons drawing
		for(var i=0 ; i < weapons.length ; i++){
			var weaponWidth = 0, weaponColor;
			switch(weapons[i].type){
				case GRAPPLE_HOOK_NUMBER :
				case DOUBLE_HOOK_NUMBER:
					weaponColor = GRAPPLE_HOOK_COLOR;
					weaponWidth = HOOK_WITDH;
					break;

				case TRIDENT_NUMBER :
					if(weapons[i].time < 1){
						weaponColor = TRIDENT_COLOR1 ;
					} else if(weapons[i].time < 2){
						weaponColor = TRIDENT_COLOR2 ;
					} else {
						weaponColor = TRIDENT_COLOR3 ;
					}
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
		if(player.livesNumber > 1){
			var textVictory = "VICTOIRE !";
			var textDefeat = "PERDU...";
			if(victory){
				drawFinalMessage('victory');
			} else {
				if(defeat) {
					player.livesNumber -= 1;
					defeat = false;
					levelInitialization(numLevel);    
				}
			}
		} else{
			if(victory){
				drawFinalMessage('victory');
			} else {
				if(defeat) {
					player.livesNumber -= 1;
					drawFinalMessage('defeat');
				}
			}
		}
	}
}

/**
*  Key down event
*/
captureKeyboardPress = function(event) {
	if(numLevel == 0) { // menu
		switch(event.keyCode) {
			case 13:
				numLevel = 1;
				break;
			case 49: // niveau 1
			case 50: // niveau 2
			case 51: // niveau 3
				numLevel = event.keyCode - 48;
				levelInitialization(numLevel);
				break;
		}
	} else { // jeu
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

			// Enter to insert credits and play again
            case 13: 
                if(defeat){
                    defeat = false;
                    levelInitialization(numLevel);
                    player.livesNumber = 3;
                    player.score = 0;
                } else if(victory){
                    numLevel += 1;
                    if(numLevel > MAX_LEVEL){
                        numLevel = 0;
                    }
                    victory = !victory;
                    levelInitialization(numLevel);
                }
                break;

			// Shortcut to victory                                                                      // BETA FUNCTION
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

			//Activate the powerOn double grapple hook                                                  // BETA FUNCTION
			case 84: 
				player.powerOn = DOUBLE_HOOK_NUMBER ;
				console.log("Double grappin activé");
				break;

			//Activate the powerOn Trident                                                              // BETA FUNCTION
			case 89:
				player.powerOn = TRIDENT_NUMBER ;
				console.log("Trident activé");
				break;

			//Make the player invincible                                                                // BETA FUNCTION
			case 73:
				if(isInvincible){
					console.log("Joueur plus invincible");
				} else {
				console.log("Joueur invincible");
				}
				isInvincible = !isInvincible;
				
			break;        
		}
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