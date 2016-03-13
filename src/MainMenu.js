
BasicGame.MainMenu = function(game) {
};

BasicGame.MainMenu.prototype = {

	create: function() {
		this.game.stage.backgroundColor = Phaser.Color.getColor(72, 147, 227);

		// マップ設定
		// タイトルのマップはLevel1-1を使う
		this.map = this.game.add.tilemap('map', 16, 16);
		this.map.addTilesetImage('tiles');
		this.map.setCollision(1);
		this.map.smoothed = false;

		var title = this.add.sprite(this.world.centerX, this.world.centerY, 'title');
		title.smoothed = false;
		title.pivot.x = title.width * 0.5;
		title.pivot.y = title.height * 1.2;

		this.layer = this.map.createLayer(0); //('World1')
		//this.layer.debug = true;
		this.layer.resizeWorld();

		// プレイヤー設定
		this.player = this.game.add.sprite(
			16*5,
			16*13,
			'iltan'
		);
		this.player.anchor.setTo(0.5, 0.5); // for flip
		this.player.smoothed = false;
		this.game.physics.enable(this.player);
		this.game.physics.arcade.gravity.y = 250;
		this.player.body.linearDamping = 1;
		this.player.body.collideWorldBouns = true;

		// プレイヤーアニメーション設定
		this.player.animations.add('stand', [0], 10, false);
		this.player.animations.add('walk', [1, 2], 8, true);
		this.player.animations.add('run', [2, 3], 12, true);
		this.player.animations.add('quickturn', [4], 10, false);
		this.player.animations.add('jump', [5], 10, false);
		this.player.animations.add('missed', [6], 10, false);
		this.player.play('stand');

		// ゲーム設定
		this.game.camera.follow(this.player);
		this.cursors = this.game.input.keyboard.createCursorKeys();

/*
		var button = this.add.button(
			this.game.width/2,
			3.25*this.game.height/4,
			'start',
			function() {
				this.state.start("Game");
			},
			this,
			'over', 'up', 'down'
		);
		button.pivot.x = button.width * .5;
		button.pivot.y = button.height * .5;

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
	},

	startGame: function(pointer) {
		this.state.start('Game');
	},
};
