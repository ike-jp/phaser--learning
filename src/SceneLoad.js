
BasicGame.SceneLoad = function(game) {

};

BasicGame.SceneLoad.prototype = {

	preload: function () {
	},

	create: function() {
		this.state.start('ScenePlay');
	},
};
