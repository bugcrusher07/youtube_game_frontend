import {  inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Bullet } from "../bullets/bullet.service";
import { EnemyData } from "../enemies/enemies.service";

@Injectable({
  providedIn:"root",
})
export class ThreejsService{

  scene = new THREE.Scene();
  camera !: THREE.PerspectiveCamera
  renderer !:THREE.WebGLRenderer;
  cube!:THREE.Mesh;
  control!:OrbitControls;
  plane!:THREE.Mesh;
  bullets:Bullet[] = [] ;
  clock = new THREE.Clock();
  bulletInterval!: number;
  enemies: THREE.Object3D[] = [];
  private lastEnemyMoveTime = 0;
private enemyMoveInterval = 50; // milliseconds between moves
private enemySpeed = 0.5;

  initCamera(container?: HTMLElement) {
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0,4,46.4);
    // this.camera.lookAt(this.plane.position);
    this.camera.rotation.x+=THREE.MathUtils.degToRad(0);
    // this.control?.update();
  }


  initRenderer(container?:HTMLElement){
    this.renderer = new THREE.WebGLRenderer();
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    this.renderer.setSize(width,height);
    container?.appendChild(this.renderer.domElement);
  }
  initScene(){
    this.scene.background=new THREE.Color(0xffffff);
  }


  startRenderLoop() {
    const animate =()=>{
    requestAnimationFrame(animate);
    this.renderer.render(this.scene, this.camera);
    this.updateBullets();
    this.moveEnemies();
    // console.log(`rotation is ${this.camera.rotation}`);
    // console.log(`position is ${this.camera.position}`);
    };
    animate();
  }

  addBullet(bullet: Bullet) {
    this.scene.add(bullet.mesh);
    this.bullets.push(bullet);
  }
  // removeEnemy(enemy: THREE.Object3D) {
  //   this.scene.remove(enemy);
  //   this.enemies = this.enemies.filter(e => e !== enemy);
  // }

  // handleBulletHit(bullet: Bullet) {
  //   // Find which enemy was hit and reduce HP
  //   const hitEnemy = this.enemies.find(enemy => {
  //     const enemyBox = new THREE.Box3().setFromObject(enemy);
  //     const bulletSphere = new THREE.Sphere(bullet.mesh.position, bullet.radius);
  //     return enemyBox.intersectsSphere(bulletSphere);
  //   });

  //   if (hitEnemy) {
  //     hitEnemy as any;
  //     hitEnemy.takeDamage(10);


  //     // Assuming enemies have a custom HP property
  //     // if ((hitEnemy as any)['hp'] !== undefined) {
  //     //   (hitEnemy as any)['hp'] -= 10;
  //     //   console.log('Enemy hit! Remaining HP:', (hitEnemy as any).hp);

  //     //   if ((hitEnemy as any).hp <= 0) {
  //     //     this.removeEnemy(hitEnemy);
  //     //   }
  //     // }
  //   }
  // }

private removeEnemy(enemy: THREE.Object3D) {
  // Remove both enemy mesh and its edges
  const edges = this.scene.children.find(child =>
    child instanceof THREE.LineSegments &&
    child.position.equals(enemy.position)
  );

  if (edges) this.scene.remove(edges);
  this.scene.remove(enemy);

  // Remove from enemies array
  this.enemies = this.enemies.filter(e => e !== enemy);
}
private flashEnemy(enemy: THREE.Object3D) {
  if (enemy instanceof THREE.Mesh) {
    const originalColor = (enemy.material as THREE.MeshBasicMaterial).color.clone();
    (enemy.material as THREE.MeshBasicMaterial).color.set(0xffffff);

    setTimeout(() => {
      (enemy.material as THREE.MeshBasicMaterial).color.copy(originalColor);
    }, 100);
  }
}

private handleEnemyHit(enemy: THREE.Object3D) {
  // Type-safe way to access userData
  if(enemy.userData as EnemyData){
    enemy.userData["takeDamage"](10); // Deal 10 damage per hit
    console.log(enemy.userData['hp']);
    // Visual feedback
    this.flashEnemy(enemy);

    // Check if enemy should be removed
    if (enemy.userData["hp"] <= 0) {
      this.removeEnemy(enemy);
    }
  }
}
  updateBullets() {
    const delta = this.clock.getDelta(); // Use delta time for smooth movement

    this.bullets = this.bullets.filter(bullet => {
      bullet.update(delta);
    //
    // Check collision with all enemies
    const hitEnemy = bullet.checkCollision(this.enemies);
    if (hitEnemy) {
      this.handleEnemyHit(hitEnemy);
      this.scene.remove(bullet.mesh);
      return false;
    }

    if (!bullet.isActive) {
      this.scene.remove(bullet.mesh);
      return false;
    }
    return true;
  });
  }
   startAutoFiring() {
    // Clear any existing interval
    if (this.bulletInterval) clearInterval(this.bulletInterval);

    // Fire a bullet every second (1000ms)
    this.bulletInterval = window.setInterval(() => {
      let startPosition = this.cube.position.clone();
      startPosition.z -=1;
      startPosition.y +=0.5;
      if (this.cube && (this.cube.position.x>=1|| this.cube.position.x <=- 1 )) {
        const bullet = new Bullet(
          startPosition,
          new THREE.Vector3(0,0,-1), // Fire towards -Z (towards castle)
          0x00ff00, // Green color
          10 // Faster speed
        );
        this.addBullet(bullet);
      }
    }, 1000); // 1000ms = 1 second
  }

  generateCube(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.set(0,0,40);
    this.scene.add(this.cube);
  }
  generateBridge(){
    const geometry = new THREE.PlaneGeometry( 20, 90 );
    const sideGeometry = new THREE.PlaneGeometry( 5, 90 );
    const material = new THREE.MeshBasicMaterial( {color: 0x808080,side:THREE.DoubleSide} );
    const blackMaterial = new THREE.MeshBasicMaterial({color:0xA9A9A9,side:THREE.DoubleSide});
    const sidePlane = new THREE.Mesh(sideGeometry,blackMaterial);
    const sidePlane2 = new THREE.Mesh(sideGeometry,blackMaterial);
    this.plane = new THREE.Mesh(geometry,material);
    const axesHelper = new THREE.AxesHelper( 5 );
    // this.scene.add( axesHelper );
    this.plane.rotateX(-Math.PI/2);
    sidePlane.rotateX(-Math.PI/2);
    sidePlane2.rotateX(-Math.PI/2);
    sidePlane.rotateY(-Math.PI/2);
    sidePlane2.rotateY(-Math.PI/2);
    sidePlane.position.set(-10,2.5,-3);
    sidePlane2.position.set(10,2.5,-3);
    // plane.position.z -=0.8;
    this.plane.position.z-=3;
    this.scene.add(this.plane);
    this.scene.add(sidePlane);
    this.scene.add(sidePlane2);
  }
  initOrbitalControls(container:HTMLElement){
    this.control = new OrbitControls(this.camera,container);
  }

//   loadingCastle(){
//     const loader = new GLTFLoader();
//     loader.load('castle/source/Castle.glb',(gltf)=>{
//       gltf.scene.scale.set(105,105,105);
//       gltf.scene.position.set(0,9,-74);
//       gltf.scene.traverse((child) => {
//       gltf.scene.traverse((child) => {
//         if (child instanceof THREE.Mesh && child.material) {
//     // Ensure textures are active
//       child.material.map = child.material.map; // Reassign diffuse
//     child.material.metalnessMap = child.material.metalnessMap;
//     child.material.needsUpdate = true;

//     // Override problematic PBR values
//     child.material.metalness = 0.5; // Reduce if too reflective
//     child.material.roughness = 0.5; // Adjust surface smoothness
//   }
// });
//     });
//       this.scene.add(gltf.scene)
//       gltf.scene.traverse((child:any) => {
//         child?.material?console.log("material is",child.material):console.log("nah");
//     });
//   },
//   	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	}, // Progress callback (optional)
//   (error) => {
//     console.log("error is ",error);
//     })
//   }
loadingCastle(){
    const loader = new GLTFLoader();
    loader.load('castle/source/Castle.glb', (gltf) => {
    const model = gltf.scene;

  // 1. Scale model
        model.scale.set(250,250,250);
      model.position.set(0,26,-125);

  // 2. Force texture updates
  model.traverse((child:any) => {
    if (child instanceof THREE.Mesh && child.material) {
      // Rebind textures
      child.material.map = child.material.map;
      child.material.metalnessMap = child.material.metalnessMap;
      child.material.needsUpdate = true;
      child.material.metalness = 0.5;
      child.material.roughness = 0.7;
    }
  });
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  this.scene.add(ambientLight, directionalLight);
  this.scene.add(model);
  });}

  // moveEnemies(){
  //   let delta = this.clock.getDelta();
  //   console.log(`Delta: ${delta.toFixed(4)}s, Speed: ${(1000* delta).toFixed(2)} units/frame`);
  //   for (let i = 0; i <  this.enemies.length;i++){
  //   this.enemies[i].position.z +=(1000*delta);
  //   }
  // }
moveEnemies() {
  const now = Date.now();

  // Only move enemies if enough time has passed
  if (now - this.lastEnemyMoveTime > this.enemyMoveInterval) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].position.z += this.enemySpeed;

      // Remove enemies that have passed the player
      if (this.enemies[i].position.z >40) {
        this.scene.remove(this.enemies[i]);
        this.enemies.splice(i, 1);
      }
    }
    this.lastEnemyMoveTime = now;
  }
}
  onWindowResize(container?: HTMLElement) {
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}