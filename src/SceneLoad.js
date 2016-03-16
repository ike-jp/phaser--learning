
BasicGame.SceneLoad = function(game) {

};

BasicGame.SceneLoad.prototype = {

	preload: function()
	{
		this.game.stage.backgroundColor = Phaser.Color.getColor(0, 0, 0);
	},

	create: function()
	{
		this.game.time.events.add(
			Phaser.Timer.SECOND * 1.5,
			function() {
				this.state.start('ScenePlay');
			},
			this
		);
	},
};
