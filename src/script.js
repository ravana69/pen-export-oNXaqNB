import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://threejsfundamentals.org/3rdparty/dat.gui.module.js';

let m_mes1, m_mes2, a_global,  m_global, b_global;

const main = () => {
	const canvas = document.querySelector('#canvas');
	const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha:true});
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(18);
	//--
	scene.fog = new THREE.Fog(0x000000, 9, 10);
	//--
	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.rotateSpeed = 0.8;
	controls.enableZoom = false;
	controls.enableDamping = true;
	controls.dampingFactor = .05;
	controls.update();
	//--
	camera.position.y = 5;
	camera.position.z = -9;
	scene.add(s_group);
	//--
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.outputEncoding = THREE.sRGBEncoding;
	//--
	const e_mat = (value = a_photo) => {
		return new THREE.TextureLoader().load(value);
	}
	
	const createGUI = () => {
		const gui = new GUI();
		const l_gui = gui.addFolder('Light');
		const g_gui = gui.addFolder('Material');
		const a_gui = gui.addFolder('Ambient');
		l_gui.add(a_global, 'intensity', 0, 2);
		g_gui.add(m_global, 'metalness', 0, 3).listen();
		g_gui.add(m_global, 'roughness', 0, 3).listen();
		g_gui.add(m_global, 'bumpScale', -0.05, 0.05).listen();
		g_gui.add(m_global, 'aoMapIntensity', 0, 1).listen();
		
		a_gui.add(b_global, 'roughness', 0, 3).listen();
		a_gui.add(b_global, 'metalness', 0, 3).listen();
		a_gui.add(b_global, 'alphaTest', 0, 1).listen();
		a_gui.add(m_mes2, 'scalenum', 1.01, 1.5).listen().onChange((value) => {
			m_mes2.scale.set(value,value,value)
		});
		a_gui.open();
		g_gui.open();
	}
	
	const createElements = () => {
		const c_geo = new THREE.IcosahedronGeometry(1, 3);
		const c_mat = new THREE.MeshStandardMaterial({
			map:e_mat(),
			roughness: 3,
			metalness: 0.65,
			bumpScale: -0.005,
			skinning: true,
			bumpMap: e_mat(),
			aoMap: e_mat(),
			roughnessMap: e_mat(b_photo)
		});
		m_global = c_mat;
		const c_mes = new THREE.Mesh(c_geo, c_mat);
		c_mes.receiveShadow = true;
		c_mes.castShadow = true;
		//--
		const b_mat = new THREE.MeshStandardMaterial({
			map: e_mat(c_photo),
			alphaMap: e_mat(c_photo),
			roughnessMap: e_mat(c_photo),
			transparent: true,
		});
		b_global = b_mat;
		const b_mes = new THREE.Mesh(c_geo, b_mat);
		b_mes.scalenum = 1.02;
		b_mes.scale.set(b_mes.scalenum, b_mes.scalenum, b_mes.scalenum);
		b_mes.castShadow = true;
		b_mes.receiveShadow = true;
		//--
		m_mes1 = c_mes;
		m_mes2 = b_mes;
		
		//--
		s_group.add(c_mes);
		s_group.add(b_mes);
		
	}
	
	const createLights = () => {
		const a_light = new THREE.AmbientLight(0xFFFFFF, 0.1);
		const p_light = new THREE.PointLight(0xFFFFFF, 1);
		const f_light = new THREE.PointLight(0xFFFFFF, 1);
		const b_light = new THREE.PointLight(0xFFFFFF, 1);
		p_light.position.set(0,5,0);
		f_light.position.set(5,-15,5);
		b_light.position.set(-5,15,-5);
		f_light.castShadow = true;
		p_light.castShadow = true;
		b_light.castShadow = true;
		scene.add(p_light);
		scene.add(f_light);
		scene.add(b_light);
		scene.add(a_light);
		
		a_global = a_light;
		
	}
	
	const animation = () => {
		requestAnimationFrame(animation);
		m_mes1.rotation.y += 0.002;
		m_mes2.rotation.y += 0.004;
		camera.lookAt(scene.position);
		camera.updateMatrixWorld();
		controls.update();
		renderer.render(scene, camera);
	}

	const onWindowResize = () => {
		const w = window.innerWidth;
		const h = window.innerHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}

	createElements();
	createLights();
	createGUI();
	animation();
	onWindowResize();
	
	window.addEventListener('resize', onWindowResize, false);
}

const s_group = new THREE.Group();
const a_photo = 'https://images.unsplash.com/photo-1544745494-3d8dd3fa1564?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80';
const b_photo = 'https://images.unsplash.com/photo-1502030818212-8601501607a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';
const c_photo = 'https://images.unsplash.com/photo-1581444872625-5f6de4b7564d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80';

window.addEventListener('load', main, false);