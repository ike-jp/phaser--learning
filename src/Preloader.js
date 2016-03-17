
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
		this.load.spritesheet('iltan', 'assets/iltan.png', 16, 16);
		this.load.spritesheet('enemy', 'assets/enemy.png', 16, 16);
		this.load.image('bg', 'assets/tilemaps/tiles/bg.png');
		this.load.image('terrain', 'assets/tilemaps/tiles/terrain.png');
		this.load.tilemap('map', 'assets/tilemaps/csv/level1.csv');
		this.load.tilemap('map2', 'assets/tilemaps/json/level1.json', null, Phaser.Tilemap.TILED_JSON);
	},

	create: function()
	{
		this.preloadBar.cropEnabled = false;
		//this.state.start('SceneTitle');
		this.state.start('ScenePlay');
	},
};
