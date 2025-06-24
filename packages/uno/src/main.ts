import "./index.css";
import Phaser from "phaser";
import { enable3d } from "@enable3d/phaser-extension";
import { getConfig } from "./configs/getConfig.ts";

// import { HomeScene } from "./scenes/Home";
// import { MainScene } from "./scenes/Main";
import { Scene1 } from "./scenes/Scene1";

enable3d(() => {
  const config = getConfig();

  config.scene = [] as Phaser.Types.Scenes.SceneType[];
  // config.scene.push(HomeScene);
  // config.scene.push(MainScene);
  config.scene.push(Scene1);

  // startup
  const game = new Phaser.Game(config);

  // game.scene.add(
  //   "main_scene",
  //   MainScene,
  //   true,
  //   // data will be provided to create callback
  //   {},
  // );

  // // load scene
  // game.scene.add(
  //   "table_top_scene",
  //   TableTopScene,
  //   true,
  //   // data will be provided to create callback
  //   {},
  // );

  return game;
}).withPhysics("/ammo");
