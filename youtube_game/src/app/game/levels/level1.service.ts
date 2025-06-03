import {Injectable,inject } from "@angular/core";
import * as three from 'three';
import { Enemies } from "../enemies/enemies.service";

@Injectable({
  providedIn:'root',
})
export class Level1{
    enemy = inject(Enemies);

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
    this.enemy.loadBoxEnemy(scene);
  }
  loadBigBoxEnemies(scene:three.Scene){
    this.enemy.loadBigBoxEnemy(scene);
  }
}