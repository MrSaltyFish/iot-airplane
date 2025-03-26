import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeScene = ({ sensorData }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();

      renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
      mountRef.current.appendChild(renderer.domElement);

      // Create simple airplane using basic geometries
      const airplane = new THREE.Group();

      // Fuselage (body)
      const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.1, 2, 8);
      const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x4682b4 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2; // Rotate to make it horizontal
      airplane.add(body);

      // Wings
      const wingGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.4);
      const wingMaterial = new THREE.MeshBasicMaterial({ color: 0x708090 });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      wings.position.set(0, 0, 0);
      airplane.add(wings);

      // Tail
      const tailGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.3);
      const tailMaterial = new THREE.MeshBasicMaterial({ color: 0x708090 });
      const tail = new THREE.Mesh(tailGeometry, tailMaterial);
      tail.position.set(-0.8, 0, 0);
      airplane.add(tail);

      // Vertical stabilizer
      const stabilizerGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.2);
      const stabilizerMaterial = new THREE.MeshBasicMaterial({
        color: 0x708090,
      });
      const stabilizer = new THREE.Mesh(stabilizerGeometry, stabilizerMaterial);
      stabilizer.position.set(-0.8, 0.15, 0);
      airplane.add(stabilizer);

      scene.add(airplane);
      camera.position.z = 5;

      // Store references
      sceneRef.current = { scene, camera, airplane };
      rendererRef.current = renderer;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        if (sceneRef.current) {
          // Update airplane rotation based on sensor data
          sceneRef.current.airplane.rotation.x = THREE.MathUtils.degToRad(
            sensorData.pitch
          );
          sceneRef.current.airplane.rotation.y = THREE.MathUtils.degToRad(
            sensorData.yaw
          );
          sceneRef.current.airplane.rotation.z = THREE.MathUtils.degToRad(
            -sensorData.roll
          );

          renderer.render(scene, camera);
        }
      };

      animate();
    } else {
      // Update rotations when sensor data changes
      sceneRef.current.airplane.rotation.x = THREE.MathUtils.degToRad(
        sensorData.pitch
      );
      sceneRef.current.airplane.rotation.y = THREE.MathUtils.degToRad(
        sensorData.yaw
      );
      sceneRef.current.airplane.rotation.z = THREE.MathUtils.degToRad(
        -sensorData.roll
      );
    }

    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        sceneRef.current = null;
        rendererRef.current = null;
      }
    };
  }, [sensorData]);

  return <div ref={mountRef} style={{ margin: "20px auto", width: "80%" }} />;
};

export default ThreeScene;
