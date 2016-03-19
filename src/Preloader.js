
BasicGame.Preloader = function (game) {

	this.preloadBar = null;
};

BasicGame.Preloader.prototype = {

	preload: function ()
	{
		// Create a progress bar based on cropping on image
		this.preloadBar = this.add.sprite(
			this.game.width/2,
			this.game.height/2,
			'preloader-bar'
		);
		this.preloadBar.pivot.x = this.preloadBar.width/2;
		this.preloadBar.pivot.y = this.preloadBar.height/2;
		this.load.setPreloadSprite(this.preloadBar);

		// title
		this.load.image('title', 'assets/title.png');

		// game
		this.load.spritesheet('player', 'assets/objects/player.png', 16, 16);
		this.load.spritesheet('enemies1', 'assets/objects/enemies1.png', 16, 16);
		this.load.spritesheet('enemies2', 'assets/objects/enemies2.png', 16, 16);
		this.load.spritesheet('goal-symbol', 'assets/objects/goal-symbol.png', 32, 32);
		this.load.image('bg', 'assets/tilemaps/tiles/bg.png');
		this.load.image('terrain', 'assets/tilemaps/tiles/terrain.png');
		this.load.tilemap('map', 'assets/tilemaps/json/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.bitmapFont('famania', 'assets/fonts/famania2.6-bmpfont.png', 'assets/fonts/famania2.6-bmpfont.fnt');

		this.load.image('myfont', 'assets/fonts/myfont.png');
	},

	create: function()
	{
		this.preloadBar.cropEnabled = false;
		//this.state.start('SceneTitle');
		this.state.start('ScenePlay');
	},
};
