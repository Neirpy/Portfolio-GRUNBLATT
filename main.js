import * as THREE from 'three';
import { FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {HemisphereLight} from "three";
import {modal} from "./public/js/modal.js";

modal();

gsap.registerPlugin(ScrollTrigger);


let mixer, mixer2, moi, desk,action, clock = new THREE.Clock();

const loadingManager = new THREE.LoadingManager();

const progressBar = document.querySelector('#progress-bar');
loadingManager.onProgress = (item, loaded, total) => {
  progressBar.value = loaded / total*100;
}

const progressContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = () => {
  progressContainer.style.display = 'none';
  document.body.classList.remove('noScroll');
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7, 15);
camera.lookAt(0, 0, 0);





const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#app'),
  antialias: true,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// light
const light = new THREE.DirectionalLight(0xc179b9, 1);
light.position.set(1, 1, 1);
light.castShadow=true;
light.shadow.bias=-0.0001;
light.shadow.mapSize.width=1024*4;
light.shadow.mapSize.height=1024*4;
scene.add(light);

const light2 = new THREE.DirectionalLight(0xc179b9, 1);
light2.position.set(-1, 1, 1);
light2.castShadow=true;
light2.shadow.bias=-0.0001;
light2.shadow.mapSize.width=1024*4;
light2.shadow.mapSize.height=1024*4;
scene.add(light2);

const light3 = new HemisphereLight(0xffffff, 0x000000, 1);
scene.add(light3);
//group
const group = new THREE.Group();


const loader = new FBXLoader(loadingManager);
loader.load('./assets/3d/typing.fbx', (fbx) => {
  moi = fbx;
  moi.scale.setScalar(0.07);
  moi.position.y = -5;
  moi.traverse(c => {
    c.castShadow = true;
    c.receiveShadow = true;
  });
  mixer = new THREE.AnimationMixer(moi);
  action = mixer.clipAction(moi.animations[0]);
  action.play();
  group.add(moi);
});


const  loader2 = new GLTFLoader(loadingManager);
loader2.load('./assets/3d/desk.glb', (gltf) => {
  desk = gltf.scene;
  desk.position.y = -5;
  desk.scale.setScalar(7);
  desk.traverse(c => {
    c.castShadow = true;
    c.receiveShadow = true;
  })
  mixer2 = new THREE.AnimationMixer(desk);
  action = mixer2.clipAction(gltf.animations[0]);
  action.play();
  group.add(desk);
});

scene.add(group);


//resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

//scroll animation
let scrollY = window.scrollY;
let currentSection = 0;
const scrollAnimation = () => {
  scrollY = window.scrollY


  const newSection = Math.round(scrollY / window.innerHeight);
  if (newSection !== currentSection) {
    currentSection = newSection;
  }
  return currentSection;

}

//  Snapping

// let part = gsap.utils.toArray('.part');
// gsap.to(part, {
//   yPercent: -100 * (part.length),
//   ease: "none",
//   scrollTrigger: {
//     trigger: 'section',
//     top: 'top',
//     end: 'bottom',
//     pin: true,
//     scrub: 1,
//   }
// });



ScrollTrigger.create({
  trigger: "#presentation",
  start: "30% 30%",
  end: "bottom 17%",
  onUpdate: self => {
    group.rotation.y = 3.15 * self.progress;
    camera.position.y = 5 * self.progress + 7;
    console.log(camera.position.y)
  },
})

ScrollTrigger.create({
  trigger: "#about",
  start: "50% 40%",
  endTrigger: "#about",
  end: "bottom 10%",
  onUpdate: self => {
    camera.position.z = 15 - 21 * self.progress;
    camera.position.y = -17*(self.progress*self.progress) + 8*self.progress + 12;
    camera.position.x = 0 - 0.5* self.progress;
    camera.rotation.x = -0.4366271598135413-0.09 * self.progress;
    //console.log(-17*(self.progress*self.progress) + 15*self.progress + 7)
    //7 - 4 * self.progress
  },
  pin: true,
});

ScrollTrigger.create({
  trigger: "#about",
  start: "62% 50%",
  end: "bottom 10%",
  endTrigger: "#myPage",
  toggleClass: {targets: "#myPage", className: "computerBackground"},
})


// gsap.to(group.position, {
//   scrollTrigger: {
//     trigger: '#presentation',
//     start: "center center",
//     end: "bottom 20%",
//     markers: true,
//     scrub:5,
//   },
//   x: 10,
//   duration: 3,
// });

//scroll
window.addEventListener('scroll',scrollAnimation);
const animate = function () {
    let delta = clock.getDelta();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (mixer && mixer2) {
      mixer.update(delta*0.5);
      mixer2.update(delta*0.5);
    }
}

animate();

