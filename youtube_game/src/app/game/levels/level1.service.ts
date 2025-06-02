import {Injectable } from "@angular/core";
import * as three from 'three';

@Injectable({
  providedIn:'root',
})
export class Level1{
    initdividingPlanes(scene:three.Scene){
    const geometry = new three.BoxGeometry(3,.5,75);
    const material = new three.MeshBasicMaterial({color:0x000000,side:three.DoubleSide});
    const divider =new three.Mesh(geometry,material);
    divider.rotateX(-Math.PI/2);
    divider.rotateZ(-Math.PI/2);
    divider.rotateY(-Math.PI/2);
    divider.position.set(0,.6,-3);
    scene.add(divider);
  }
}