import {inject, Injectable } from "@angular/core";
// import { ThreejsService } from "../threejs-init/threejs.service";
import * as three from 'three';

@Injectable({
  providedIn:'root',
})
export class Level2{
  // threejsService = inject(ThreejsService);
  // threeService= this.threejsService;
  initdividingPlanes(scene:three.Scene){
    const geometry = new three.PlaneGeometry(1.2,75);
    const material = new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide});
    const divider1 =new three.Mesh(geometry,material);
    const divider2 =new three.Mesh(geometry,material);
    divider1.rotateX(-Math.PI/2);
    divider2.rotateX(-Math.PI/2);
    divider1.rotateY(-Math.PI/2);
    divider2.rotateY(-Math.PI/2);
    divider1.position.set(3,.6,-3);
    divider2.position.set(-3,.6,-3);
    scene.add(divider1);
    scene.add(divider2);
  }
}