Application.namespace('SuperILtan');

var game = new Phaser.Game(256, 240, Phaser.AUTO, 'game');
//var game = new Phaser.Game(256, 240, Phaser.CANVAS, 'game');
game.state.add('BootState', SuperILtan.BootState);
game.state.add('ScenePreload', SuperILtan.PreloadState);
game.state.add('SceneTitle', SuperILtan.TitleState);
game.state.add('SceneLoad', SuperILtan.LoadingState);
game.state.add('ScenePlay', SuperILtan.GameState);

game.state.start('BootState');
