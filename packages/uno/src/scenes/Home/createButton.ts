import Phaser from "phaser";

const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export function createButton(scene: Phaser.Scene, label: string) {
  return scene.rexUI.add.label({
    width: 40,
    height: 40,
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
    text: scene.add.text(0, 0, label, {
      fontSize: 18,
    }),
    space: {
      left: 10,
      right: 10,
    },
    align: "center",
    name: label,
  });
}
