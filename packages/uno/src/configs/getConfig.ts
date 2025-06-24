import Phaser from "phaser";
import { Canvas } from "@enable3d/phaser-extension";

export function getConfig(): Phaser.Types.Core.GameConfig {
  const inner_width =
    window.innerWidth * Math.max(1, window.devicePixelRatio / 2);
  const inner_height =
    window.innerHeight * Math.max(1, window.devicePixelRatio / 2);

  return {
    type: Phaser.WEBGL, //canvas or webgl
    // type: Phaser.AUTO, //canvas or webgl

    transparent: true,
    // backgroundColor: `#000000`,

    plugins: {
      scene: [
        // {
        //   key: "rexUI",
        //   mapping: "rexUI",
        //   plugin: RexUI,
        // },
      ],
    },
    scale: {
      mode: Phaser.Scale.FIT,
      // mode: Phaser.Scale.Center,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "app",
      width: 1920,
      height: 1080,
    },
    // physics: {
    //   default: "arcade",
    //   arcade: {
    //     gravity: { y: 200 },
    //   },
    // },
    ...Canvas(),
  };
}
