import * as THREE from 'three'
import './styles/style.scss'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 1. Setting scene
const scene = new THREE.Scene()

// 2. Create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
  color: 'purple',
  roughness: 0.6
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// 3. Light
const light = new THREE.PointLight(0xffffff, 1, 100)
scene.add(light)
light.position.set(0, 10, 10)
light.intensity = 1.4

// 4. Camera 
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// 5. Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(4)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 0.5

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//gsap timeline
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo('.lead', {opacity: "0"}, {opacity: "1"})

let mousedown = false
let rgb = []
window.addEventListener('mousedown', () => {
  mousedown = true
})
window.addEventListener('mouseup', () => {
  mousedown = false
})

window.addEventListener("mousemove", (e) => {
  if (mousedown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      255
    ]
    //animation
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {
      r: newColor.r, 
      g: newColor.g, 
      b: newColor.b
    })
  }
})

mesh.position.z = 1
mesh.position.setX(-1)

const faders = document.querySelectorAll('.project__container')

const options = {
    rootMargin: "-100px 0px -100px 0px"
}

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
        } else {
          entry.target.classList.remove('fade-in')
        }
    })
}, options)

faders.forEach(fader => {
    appearOnScroll.observe(fader)
})

// const form = document.querySelector('.form')
// const message = document.querySelector('.submitted')
// const nameField = document.querySelector('.form__name')
// const emailField = document.querySelector('.form__email')
// const messageField = document.querySelector('.form__message')

// form.addEventListener('submit', (e) => {

//   if (nameField.value == '' && emailField.value == '' && messageField.value == '') {
//     return
//   }

//   nameField.value = ''
//   emailField.value = ''
//   messageField.value = ''

//   message.classList.add('true')
//   setTimeout(() => {
//     message.classList.remove('true')
//   }, 2000)
// })