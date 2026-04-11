import * as THREE from 'three'
import Experience from './Experience.js'

export default class WallIntro
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.time = this.experience.time

        this.setModel()
    }

    setModel()
    {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = 1024
        canvas.height = 320

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#ffffff'
        ctx.font = '700 64px Inter, system-ui, sans-serif'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'center'

        const cx = canvas.width / 2
        ctx.fillText('Sajud Hamza', cx, 40)
        ctx.fillText('Elinjulliparambil', cx, 112)

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.font = '500 30px Inter, system-ui, sans-serif'
        ctx.fillText('Researcher · Data Engineer · Developer', cx, 210)

        ctx.fillStyle = '#6366f1'
        ctx.fillRect(cx - 50, 265, 100, 3)

        const texture = new THREE.CanvasTexture(canvas)
        texture.encoding = THREE.sRGBEncoding

        const aspect = canvas.width / canvas.height
        const planeHeight = 2.2
        const planeWidth = planeHeight * aspect

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        geometry.rotateY(-Math.PI * 0.5)

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        })

        this.mesh = new THREE.Mesh(geometry, material)
        // On the red wall, well above the TV
        this.mesh.position.set(4.18, 4.6, 1.3)
        this.scene.add(this.mesh)

        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder({
                title: 'wallIntro',
                expanded: false
            })

            this.debugFolder.addInput(this.mesh.position, 'x', { label: 'posX', min: 2, max: 6, step: 0.01 })
            this.debugFolder.addInput(this.mesh.position, 'y', { label: 'posY', min: 1, max: 6, step: 0.01 })
            this.debugFolder.addInput(this.mesh.position, 'z', { label: 'posZ', min: -3, max: 5, step: 0.01 })
        }
    }

    update()
    {
    }
}
