import * as PIXI from 'pixi.js'

export class Canvas extends PIXI.EventEmitter {
  public app: PIXI.Application
  public history: string[] = []
  public touchMoveEnabled: boolean = false
  public pointerMoveEnabled: boolean = false

  constructor() {
    super();
    this.app = new PIXI.Application();
  }

  async init() {
    await this.app.init({
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      resizeTo: document.getElementById('pixi-canvas') as HTMLDivElement,
      backgroundAlpha: 0,
      canvas: document.createElement('canvas'),
      preference: 'webgl',
      eventMode: 'passive',
      eventFeatures: {
        move: true,
        /* disables the global move events which can be very expensive in large scenes */
        globalMove: false,
        click: true,
        wheel: true,
      },
    });

    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on('pointerdown', this.onPointerDown);
    this.app.stage.on('pointerup', this.onPointerUp);
    this.app.stage.on('pointermove', this.onPointerMove);
    this.app.stage.on('touchstart', this.onTouchStart);
    this.app.stage.on('touchend', this.onTouchEnd);
    this.app.stage.on('touchmove', this.onTouchMove);
    this.app.stage.on('wheel', this.onWheel);
  }

  switchPointerMove() {
    this.pointerMoveEnabled = !this.pointerMoveEnabled;
  }

  switchTouchMove() {
    this.touchMoveEnabled = !this.touchMoveEnabled;
  }

  onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    console.log('pointer down');
    this.history.push('pointer down');
    this.emit('history:change');
  }

  onPointerUp = (event: PIXI.FederatedPointerEvent) => {
    console.log('pointer up', event);
    this.history.push('pointer up');
    this.emit('history:change');
  }

  onPointerMove = (event: PIXI.FederatedPointerEvent) => {
    if(!this.pointerMoveEnabled) return;
    console.log('pointer move', event);
    this.history.push('pointer move');
    this.emit('history:change');
  }

  onTouchStart = (event: PIXI.FederatedPointerEvent) => {
    console.log('touch start', event);
    this.history.push('touch start');
    this.emit('history:change');
  }

  onTouchEnd = (event: PIXI.FederatedPointerEvent) => {
    console.log('touch end', event);
    this.history.push('touch end');
    this.emit('history:change');
  }

  onTouchMove = (event: PIXI.FederatedPointerEvent) => {
    if(!this.touchMoveEnabled) return;
    console.log('touch move', event);
    this.history.push('touch move');
    this.emit('history:change');
  }

  onWheel = (event: PIXI.FederatedWheelEvent) => {
    console.log('wheel', event);
    this.history.push('wheel with CTRL ', event.ctrlKey ? 'pressed' : 'not pressed');
    this.emit('history:change');
  }
}