
BasicGame.Preloader = function (game) {

	this.preloadBar = null;
	this.ready = false;
};

BasicGame.Preloader.prototype = {

	preload: function () {

		// Create a progress bar based on cropping on image
		this.preloadBar = this.add.sprite(
			this.game.width/2,
			this.game.height/2,
			'preloader-bar'
		);
		this.preloadBar.pivot.x = this.preloadBar.width/2;
		this.preloadBar.pivot.y = this.preloadBar.height/2;
		this.load.setPreloadSprite(this.preloadBar);

		this.load.spritesheet('duke', 'assets/spritesheet-duke.png', 50, 72);
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
		this.state.start('MainMenu');
	},
};
