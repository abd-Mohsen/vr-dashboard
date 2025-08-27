import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// @ts-ignore
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

interface ModelViewerProps {
  modelUrl: string | null;
}

const GLBModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
};

const OBJModel: React.FC<{ url: string }> = ({ url }) => {
  const [obj, setObj] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const loadOBJ = async () => {
      try {
        const basePath = url.substring(0, url.lastIndexOf("/") + 1);
        const objName = url.split("/").pop()!;
        const mtlUrl = url.replace(".obj", ".mtl");

        // Try loading .mtl if available
        try {
          const mtlLoader = new MTLLoader();
          mtlLoader.setResourcePath(basePath);
          mtlLoader.setPath(basePath);

          const materials = await mtlLoader.loadAsync(mtlUrl);
          materials.preload();

          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath(basePath);

          const object = await objLoader.loadAsync(objName);
          object.scale.set(1.2, 1.2, 1.2);
          setObj(object);
        } catch {
          // If there's no MTL, load OBJ directly
          const objLoader = new OBJLoader();
          const object = await objLoader.loadAsync(url);
          object.scale.set(1.2, 1.2, 1.2);
          setObj(object);
        }
      } catch (error) {
        console.error("Failed to load OBJ model:", error);
      }
    };

    loadOBJ();
  }, [url]);

  if (!obj) return null;
  return <primitive object={obj} />;
};

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  if (!modelUrl) {
    return <p>No model yet</p>;
  }

  const isGLB = modelUrl.toLowerCase().endsWith(".glb");
  const isOBJ = modelUrl.toLowerCase().endsWith(".obj");

  return (
    <div className="model-viewer" style={{ height: "400px", width: "100%" }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          {isGLB && <GLBModel url={modelUrl} />}
          {isOBJ && <OBJModel url={modelUrl} />}
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
