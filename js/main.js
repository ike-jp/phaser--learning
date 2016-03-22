var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game');
//var game = new Phaser.Game(256, 240, Phaser.CANVAS, 'game');

game.state.add('Boot', BasicGame.Boot);
game.state.add('ScenePreload', App.Scene.PreloadScene);
game.state.add('SceneTitle', App.Scene.TitleScene);
game.state.add('SceneLoad', App.Scene.LoadScene);
game.state.add('ScenePlay', App.Scene.PlayScene);

game.state.start('Boot');
