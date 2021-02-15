import * as THREE from "three";

class App
{
	constructor()
	{
		const container			= document.body;
		const fov				= 45;
		
		this.renderer			= new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		
		container.appendChild(this.renderer.domElement);
		
		this.camera				= new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 10 );
		
		this.initScene();
		
		requestAnimationFrame(() => {
			this.onAnimationFrame();
		});
	}
	
	initScene()
	{
		this.scene				= new THREE.Scene();
		
		// Demo cube
		const geometry			= new THREE.BoxGeometry();
		const material			= new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		const cube				= new THREE.Mesh( geometry, material );
		
		cube.rotation.x			= 30 / 180 * Math.PI;
		cube.rotation.y			= 45 / 180 * Math.PI;
		
		this.scene.add( cube );
	}
	
	onAnimationFrame()
	{
		this.renderer.render( this.scene, this.camera );
		
		requestAnimationFrame(() => {
			this.onAnimationFrame();
		});
	}
}

export default App;