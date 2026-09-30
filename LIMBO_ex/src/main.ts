import Phaser from 'phaser';
import { IntroScene } from './scenes/IntroScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#02040a',
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 720,
    min: { width: 320, height: 240 },
    max: { width: 1920, height: 1440 }
  },
  render: { roundPixels: true },
  input: { activePointers: 3 },
  scene: [IntroScene]
};

new Phaser.Game(config);
