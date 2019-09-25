import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import * as THREE from 'three';
import {AmbientLight, Color, Material, Mesh, MeshBasicMaterial, Object3D} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import {TextureService} from '../texture.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  material: MeshBasicMaterial;
  constructor(
      public _renderer: Renderer2, public elementRef: ElementRef,
      public textureService: TextureService) {}

  camera: THREE.PerspectiveCamera;
  light: THREE.AmbientLight;
  scene: THREE.Scene;
  renderer: THREE.Renderer;
  mesh: THREE.Mesh;
  ngOnInit() {
    this.textureService.texture$.subscribe(color => this.onColorChange(color));
    this.material = new MeshBasicMaterial({color: 'purple'});
    this.camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.01, 10);
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.appendChild(
        this.elementRef.nativeElement, this.renderer.domElement);
    const loader = new GLTFLoader();
    loader.setPath('/assets/');
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    loader.load(
        'scene.gltf',
        (gltf) => {
          this.scene.add(gltf.scene);
          // immediately use the texture for material creation
          const isMesh = (obj: Object3D): obj is Mesh => (obj as Mesh).isMesh;
          this.scene.traverse((object3d) => {
            if (isMesh(object3d) &&
                (object3d.material as Material).name === 'Physical7') {
              object3d.material = this.material;
            }
          });

          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());

          gltf.scene.position.x += (gltf.scene.position.x - center.x);
          gltf.scene.position.y += (gltf.scene.position.y - center.y);
          gltf.scene.position.z += (gltf.scene.position.z - center.z);
          controls.maxDistance = size * 10;
          this.camera.near = size / 100;
          this.camera.far = size * 100;
          this.camera.updateProjectionMatrix();
          this.camera.position.copy(center);
          this.camera.position.x += size / 2.0;
          this.camera.position.y += size / 5.0;
          this.camera.position.z += size / 2.0;
          this.camera.lookAt(center);
        },
        undefined,
        function(error) {
          console.error(error);
        });


    this.scene.add(new AmbientLight(0x606060));
    this.animate();
  }
  onColorChange(color: string): void {
    console.log(color);
    this.material.color = new THREE.Color(color);
    this.material.needsUpdate = true;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
  }
}
