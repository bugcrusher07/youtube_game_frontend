import { Injectable,inject } from "@angular/core";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as three from 'three';
import { ThreejsService } from "../threejs-init/threejs.service";
export interface EnemyData {
      hp: number;
      takeDamage: (amount: number) => void;
   }
@Injectable({
  providedIn:"root",
})
export class Enemies{
loader = new GLTFLoader();
threejsService = inject(ThreejsService);
  loadEnemies(scene:three.Scene){
    this.loader.load('cyber_samurai/scene.gltf',(gltf)=>{
      const model = gltf.scene
      model.scale.set(10,10,10,);
      model.traverse((child:any) => {
        if (child instanceof three.Mesh && child.material) {
      // Rebind textures
          child.material.map = child.material.map;
          child.material.metalnessMap = child.material.metalnessMap;
          child.material.needsUpdate = true;

      // Adjust PBR values
          child.material.metalness = 0.5;
          child.material.roughness = 0.7;
        }
     });
    scene.add(model);
    })
   }

    loadBoxEnemy(scene:three.Scene,xPos:number){
      const geometry = new three.BoxGeometry(1,5,1);
      const material = new three.MeshBasicMaterial({color:0xa020f0});
      const enemy = new three.Mesh(geometry,material);
      enemy.position.set(xPos,2.505,-45);

      enemy.userData={
        hp:100,
        takeDamage: (amount: number) => {
        enemy.userData['hp'] -= amount;
          if (enemy.userData['hp'] <= 0) {
          scene.remove(enemy);
          console.log("Enemy destroyed!");
          }
        }
      } as EnemyData;

      const edgesGeometry = new three.EdgesGeometry(geometry);
      const edgeMaterial = new three.LineBasicMaterial({ color: 0xffffff, linewidth: 0.5 });
      const edges = new three.LineSegments(edgesGeometry, edgeMaterial);
      edges.position.set(0,2.505,-45);
      scene.add(enemy);
      scene.add(edges);
      this.threejsService.enemies.push(enemy);
   }
   loadBigBoxEnemy(scene:three.Scene, xPos:number){
      const geometry = new three.BoxGeometry(4,10,5);
      const material = new three.MeshBasicMaterial({color:0xa020f0});
      const enemy = new three.Mesh(geometry,material);
      enemy.position.set(xPos,5.005,0);
      enemy.userData={
        hp:1000,
        takeDamage: (amount: number) => {
        enemy.userData['hp'] -= amount;
          if (enemy.userData['hp'] <= 0) {
          scene.remove(enemy);
          console.log("Enemy destroyed!");
          }
        }
      }

      const edgesGeometry = new three.EdgesGeometry(geometry);
      const edgeMaterial = new three.LineBasicMaterial({ color: 0xffffff, linewidth: 0.5 });
      const edges = new three.LineSegments(edgesGeometry, edgeMaterial);
      edges.position.set(0,5.005,0);
      scene.add(enemy);
      scene.add(edges);
      this.threejsService.enemies.push(enemy);
   }

   load10BoxEnemy(){}
   load5BoxEnemy(){}
   load20BoxEnemy(){}
}