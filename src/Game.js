
BasicGame.Game = function(game) {

	// When a State is added to Phaser it automatically has the
	// following properties set on it, even if they already exist:
	//
	this.game;		//  a reference to the currently running game
	this.add;		//  used to add this.playerites, text, groups, etc
	this.camera;	//  a reference to the game camera
	this.cache;		//  the game cache
	this.input;		//  the global input manager (you can access
					//  this.input.keyboard, this.input.mouse, as well
					//  from it)
	this.load;		//  for preloading assets
	this.math;		//  lots of useful common math operations
	this.sound;		//  the sound manager - add a sound, play one,
					//  set-up markers, etc
	this.stage;		//  the game stage
	this.time;		//  the clock
	this.tweens;	//  the tween manager
	this.world;		//  the game world
	this.particles;	//  the particle manager
	this.physics;	//  the physics manager
	this.rnd;		//  the repeatable random number generator

	//  You can use any of these from any function within this State.
	//  But do consider them as being 'reserved words', i.e. don't create
	//  a property for your own game called "world" or you'll over-write
	//  the world reference.
	//
	this.map;
	this.layer;
	this.player;
	this.cursors;
};

BasicGame.Game.prototype = {

	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.stage.backgroundColor = Phaser.Color.getColor(72, 147, 227);

		this.map = this.game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tiles');
		this.map.setCollision(1);

		this.layer = this.map.createLayer(0); //('World1')
		//this.layer.debug = true;
		this.layer.resizeWorld();

		this.player = this.game.add.sprite(
			this.game.world.centerX,
			this.game.world.centerY,
			'iltan'
		);
		this.game.physics.enable(this.player);
		this.game.physics.arcade.gravity.y = 250;

		//this.player.animations.add('wave', null, 8, true);
		//this.player.play('wave');
		this.player.body.linearDamping = 1;
		this.player.body.collideWorldBouns = true;

		this.game.camera.follow(this.player);
		this.cursors = this.game.input.keyboard.createCursorKeys();
/*
		var fullscreen = this.add.button(
			this.game.width-8,
			this.game.height-8,
			'fullscreen',
			BasicGame.toggleFullscreen,
			this,
			'over', 'up', 'down'
		);
		fullscreen.pivot.x = fullscreen.width;
		fullscreen.pivot.y = fullscreen.height;
*/
	},

	update: function() {
		this.game.physics.arcade.collide(this.player, this.layer);

		this.player.body.velocity.x = 0;
		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -150;
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 150;
		}

		if (this.cursors.up.isDown) {
			if (this.player.body.onFloor()) {
				this.player.body.velocity.y = -200;
			}
		}
	},

	render: function() {
		//this.game.debug.bodyInfo(this.player, 0, 0);
	},

	quitGame: function(pointer) {
		this.state.start('MainMenu');
	}
};
