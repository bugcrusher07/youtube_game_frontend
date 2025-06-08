import * as three from 'three';

export class Bullet{
  mesh: three.Mesh;
  isActive = true;
  speed: number;
  direction:three.Vector3;
  radius=0.1;

  constructor(
    position: three.Vector3,
    direction: three.Vector3,
    color: number= 0xffffff,
    speed: number = 0.5,  ) {
    this.speed = speed;
    // this.mesh = new three.Mesh(
    // new three.SphereGeometry(0.1, 16, 16),
    // new three.MeshBasicMaterial({ color:new three.Color(color) }));
    this.mesh = new three.Mesh(
    new three.CylinderGeometry(0.1,0.1, 0.7, 10),
    new three.MeshPhongMaterial({
    color: new three.Color(color),
    emissive: new three.Color(0xffffff),
    emissiveIntensity: 0.5,
    specular: 0x111111,
    shininess: 30
  })
);
    this.mesh.rotateX(Math.PI/2);
    this.mesh.position.copy(position);
    this.direction = direction.normalize();
  }
  //  checkCollision(objects: three.Object3D[]): boolean {
  //   const bulletBoundingSphere= new three.Sphere(
  //     this.mesh.position,
  //     this.radius
  //   );

  //   return objects.some(object => {
  //     if (object instanceof three.Mesh) {
  //       const objectBox = new three.Box3().setFromObject(object);
  //       return bulletBoundingSphere.intersectsBox(objectBox);
  //     }
  //     return false;
  //   });
  // }
   checkCollision(enemies: three.Object3D[]): three.Object3D | null {
    const bulletBoundingBox = new three.Box3().setFromObject(this.mesh);

    for (const enemy of enemies) {
      if (enemy instanceof three.Mesh) {
        const enemyBox = new three.Box3().setFromObject(enemy);
        if (bulletBoundingBox.intersectsBox(enemyBox)) {
          return enemy; // Return the collided enemy
        }
      }
    }
    return null;
  }
  update(delta:number) {
    this.mesh.position.addScaledVector(this.direction, this.speed*delta);
    if (this.mesh.position.length() > 55) this.isActive = false;
    // this.isActive= true;
  }

}
