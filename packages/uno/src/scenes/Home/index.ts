export class HomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: "home_scene",
    });
  }

  init() {
    //...
  }

  preload() {
    this.load.svg("logo_uno", "assets/logo_uno.svg", {
      width: 400,
      height: 400,
    });
    this.load.image("card_makima", "assets/card_makima.png");
    this.load.image("card_lucy", "assets/card_lucy.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#2c4d64");

    const w_center = (this.game.config.width as number) / 2;
    const h_center = (this.game.config.height as number) / 2;

    const card_makima = this.add.sprite(160, 320, "card_makima");
    const card_lucy = this.add.sprite(480, 320, "card_lucy");

    const logo = this.add
      .image(w_center, h_center, "logo_uno")
      .setOrigin(0.5, 0.5);

    const startButton = this.add
      .text(w_center, h_center + 280, "Start", {
        fontFamily: "Arial",
        fontSize: 48,
        color: "#000000",
        backgroundColor: "#ffffff",
        padding: {
          x: 36,
          y: 12,
        },
      })
      .setFontFamily("Roboto")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("main_scene");
      });
  }
}

class UIScene extends Phaser.Scene {
  constructor() {
    // active here
    super({ key: "UIScene", active: true });
  }
}
