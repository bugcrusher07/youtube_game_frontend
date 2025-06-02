import {  Injectable } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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

  initCamera(container?: HTMLElement) {
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0,4,46.4);
    // this.camera.lookAt(this.plane.position);
    this.camera.rotation.x+=THREE.MathUtils.degToRad(0);
    // this.control?.update();
  }

  controls(eventListner:EventListener){

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
  generateCube(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.set(0,0,40) ;
    this.scene.add(this.cube );
  }
  startRenderLoop() {
    const animate =()=>{
    requestAnimationFrame(animate);
    this.cube.rotation.x+=0.005;
    this.cube.rotation.y+=0.005;
    this.renderer.render(this.scene, this.camera);
    // console.log(`rotation is ${this.camera.rotation}`);
    // console.log(`position is ${this.camera.position}`);
    };
    animate();
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
    this.scene.add( axesHelper );
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

      // Adjust PBR values
      child.material.metalness = 0.5;
      child.material.roughness = 0.7;
    }
  });

  // 3. Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  this.scene.add(ambientLight, directionalLight);

  this.scene.add(model);
});}

  onWindowResize(container?: HTMLElement) {
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}