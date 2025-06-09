import {Injectable,inject } from "@angular/core";
import * as three from 'three';
import { Enemies } from "../enemies/enemies.service";

@Injectable({
  providedIn:'root',
})
export class Level1{
    enemy = inject(Enemies);
    numOfSmallEnemies:number = 10;
    numOfBigEnemies:number = 1
    MIN_X = -8;
    MAX_X = 8;
    DIVIDER_BUFFER = 2
    leftArea = {
      minX:this.MIN_X,
      maxX:-this.DIVIDER_BUFFER
    }
    rightArea ={
      minX:this.DIVIDER_BUFFER,
      maxX:this.MAX_X
    }


    initdividingPlanes(scene:three.Scene){
    const geometry = new three.BoxGeometry(2,0.5,75);
    const material = [
      new three.MeshBasicMaterial({color:0xffffff,side:three.DoubleSide}),
      new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide}),
      new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide}),
      new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide}),
      new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide}),
      new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide}),

    ];
    const edgesGeometry = new three.EdgesGeometry(geometry);
    const edgeMaterial = new three.LineBasicMaterial({ color: 0xffffff, linewidth: 0.5 });
    const edges = new three.LineSegments(edgesGeometry, edgeMaterial);
    const divider =new three.Mesh(geometry,material);
    divider.rotateX(-Math.PI/2);
    edges.rotateX(-Math.PI/2);
    divider.rotateZ(-Math.PI/2);
    edges.rotateZ(-Math.PI/2);
    divider.rotateY(-Math.PI/2);
    edges.rotateY(-Math.PI/2);
    edges.position.set(0,.6,-3);
    divider.position.set(0,.6,-3);
    scene.add(divider);
    // scene.add(edges)
  }

  loadEnemies(scene:three.Scene){
    if (this.numOfSmallEnemies>0){
      const spawnSide = ((Math.random()) > 0.5) ? this.rightArea:this.leftArea;
    const randomPos = spawnSide.minX + Math.random()* ( spawnSide.maxX-spawnSide.minX);
    this.enemy.loadBoxEnemy(scene,randomPos);
    this.numOfSmallEnemies-=1;
    }else if(this.numOfBigEnemies>0){
      const spawnSide = ((Math.random()) > 0.5) ? this.rightArea:this.leftArea;
      const randomPos= spawnSide.minX + Math.random()* ( spawnSide.maxX-spawnSide.minX);
      this.loadBigBoxEnemies(scene,randomPos);
      this.numOfBigEnemies-=1;
    }
  }
  loadBigBoxEnemies(scene:three.Scene,randomPos:number){
    this.enemy.loadBigBoxEnemy(scene,randomPos);
  }
}