/// <reference types="vite/client" />

declare module "phaser" {
  interface Scene {
    rexUI: RexUI;
  }
}

declare interface Window {
  Ammo: any;
}

export {};
