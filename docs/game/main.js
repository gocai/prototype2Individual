// The title of the game to be displayed on the title screen
title = "GOBLIN FIGHT";

// The description, which is also displayed on the title screen
description = `Punch Them
`;

// The array of custom sprites
characters = [
`  
  ll
llllll
rrllrr  
  ll
  ll
`
,
`
 ggg
 ggg
lg gl
`
];

// Game design variable container
const G = {
	WIDTH: 100,
	HEIGHT: 100,

    PLAYER_SLASH_SPEED: 2,
    SLASH_THRESHHOLD: 20,

    GOBLIN_MIN_SPEED: 1.0,
    GOBLIN_MAX_BASE_SPEED: 2.0,

};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 2,
    isPlayingBgm: true,
    theme: "crt", 
};

// Goblin structure
/**
 * @typedef {{
 * pos: Vector,
 * }} Goblin
 */

/**
 * @type { Goblin [] }
 */
let goblins;

/**
 * @type { number }
 */
let goblinSpeed;

/**
 * @typedef {{
* pos: Vector,
* slashCooldown: number
* }} Player
*/
// Player Structure
/**
* @type { Player }
*/
let player;
//Sword Slash
/**
 * @typedef {{
* pos: Vector
* }} Slash
*/

/**
* @type { Slash [] }
*/
let slash;

// The game loop function
function update() {
	if (!ticks) {
        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
            slashCooldown: G.PLAYER_SLASH_SPEED
        };
        slash = [];
        goblins = [];
	}
	
    if(goblins.length == 0){
        for(let i = 0; i <= 9; i++){
            goblinSpeed = rnd(G.GOBLIN_MIN_SPEED,G.GOBLIN_MAX_BASE_SPEED);
            const posX = G.WIDTH;
            const posY = 50;
            goblins.push({ pos: vec(posX, posY) })
        }
    }

    //player controls and position!
    player.pos = vec(10,49.75);
    //if(input.isPressed) player.pos.y -= 10;
    player.slashCooldown--;
    if(input.isJustPressed && player.slashCooldown <= 0){ 
    slash.push({pos: vec(player.pos.x + 5, player.pos.y)});
    player.slashCooldown = G.PLAYER_SLASH_SPEED
    }
    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);

    
    color ("black");
    char("a", player.pos);

    //drawing the slash, and containing it to a short range
    slash.forEach((s) => {
        s.pos.x += G.PLAYER_SLASH_SPEED;
        remove(slash,(s) => {
            return s.pos.x > G.SLASH_THRESHHOLD;
        })
        color("red");
        box(s.pos,2);
        particle(
            player.pos.x, // x coordinate
            player.pos.y, // y coordinate
            1, // The number of particles
            .9, // The speed of the particles
            10, // The emitting angle
            5,  // The emitting width
        );
    });
    color("blue");

    
    remove(goblins,(g)=>{
        g.pos.x -= goblinSpeed;
        color("green");
        //char("b",g.pos);

        const isPunched = char("b",g.pos).isColliding.rect.red;
        if(isPunched){
            color("red");
            particle(g.pos);
            addScore(1);
            play("hit");
        }
        const playerPunched = char("b",g.pos).isColliding.char.a;
        if(playerPunched){
            end();
            play("explosion");
        }
        return (isPunched || g.pos.x < 0)
    });
    //debugging for resource management
    //text(slash.length.toString(), 3, 10);
}