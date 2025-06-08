import { inject,AfterViewInit,ViewChild,ElementRef,Component } from "@angular/core";
// import * as three from 'three';
import { ThreejsService } from "../threejs-init/threejs.service";
import { Level2 } from "../levels/level2.service";
import { Level1 } from "../levels/level1.service";
import { Enemies } from "../enemies/enemies.service";
// import { Player } from "../player/player.service";


@Component({
  selector:`game-scene`,
  template:`<div #gameDiv class="game-div"></div>`,
  styles:[`.game-div{
    width:100%;
    height:100%;
  }`],
})
export class GameScene implements AfterViewInit{

  @ViewChild('gameDiv',{static:true})gameDiv!:ElementRef<HTMLDivElement>;
  threejsService =inject(ThreejsService);
  level2 = inject(Level2);
  level1 = inject(Level1);
  enemies = inject(Enemies);
  // playerInstance = inject(Player);
  // player = this.playerInstance.generateCube(this.threejsService.scene);

    takingInput = (e:KeyboardEvent)=>{
    if(!this.threejsService) return;

    switch(e.key){
      case "a":
        if(this.threejsService.cube.position.x >=-8){
       this.threejsService.cube.position.x -=0.5;}
       break;
       case "d":
        if(this.threejsService.cube.position.x <=8){
        this.threejsService.cube.position.x +=0.5;}
        break;
      default:
        return;
    }
  }


  ngAfterViewInit(): void {
    window.addEventListener('keydown',this.takingInput);
    window.setInterval(()=>{this.level1.loadEnemies(this.threejsService.scene)},1000);
    let gameDiv = this.gameDiv.nativeElement;
    this.threejsService.initCamera(gameDiv);
    this.threejsService.initOrbitalControls(gameDiv);
    this.threejsService.initRenderer(gameDiv);
    this.threejsService.initScene();
    this.level1.initdividingPlanes(this.threejsService.scene);
    this.threejsService.startAutoFiring();
    this.threejsService.generateCube();
    // this.level2.initdividingPlanes(this.threejsService.scene);
    this.threejsService.generateBridge();
    // this.threejsService.generateCube();
    this.threejsService.loadingCastle();
    // this.enemies.loadEnemies(this.threejsService.scene);
    // this.enemies.loadBoxEnemy(this.threejsService.scene);
    // this.level1.loadEnemies(this.threejsService.scene);
    // this.level1.loadBigBoxEnemies(this.threejsService.scene);

    this.threejsService.startRenderLoop();
  }
}