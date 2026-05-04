import React, { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { EXRLoader } from 'three-stdlib';
import { Group, Mesh, MeshStandardMaterial, SRGBColorSpace, LinearSRGBColorSpace } from 'three';

interface OBJModelViewerProps {
  objUrl: string;
  mtlUrl?: string;
  textures?: string[];
  autoRotate?: boolean;
}

interface ModelProps {
  objUrl: string;
  mtlUrl?: string;
  textures?: string[];
  autoRotate?: boolean;
}

const Loader: React.FC = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white', textAlign: 'center' }}>
        Loading... {Math.round(progress)}%
      </div>
    </Html>
  );
};

const Model: React.FC<ModelProps> = ({ objUrl, mtlUrl, textures, autoRotate = false }) => {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [materials, setMaterials] = useState<any>(null);

  // Use useFrame only if autoRotate is enabled
  const frameRef = useRef<number>(0);
  
  // Custom texture loader that handles EXR files
  const loadTexture = useCallback((url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const isEXR = url.toLowerCase().endsWith('.exr');
      const loader = isEXR ? new EXRLoader() : new TextureLoader();
      
      loader.load(
        url,
        (texture) => {
          if (isEXR) {
            texture.colorSpace = LinearSRGBColorSpace;
          } else {
            texture.colorSpace = SRGBColorSpace;
          }
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }, []);

  // Load MTL materials if provided
  React.useEffect(() => {
    if (mtlUrl) {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(mtlUrl, (mtl) => {
        mtl.preload();
        setMaterials(mtl);
      });
    }
  }, [mtlUrl]);

  // Load OBJ model and apply textures
  React.useEffect(() => {
    const objLoader = new OBJLoader();
    
    if (materials) {
      objLoader.setMaterials(materials);
    }

    objLoader.load(objUrl, async (object) => {
      setModel(object);
      
      // Apply textures if provided
      if (textures && textures.length > 0) {
        try {
          const texturePromises = textures.map(loadTexture);
          const loadedTextures = await Promise.all(texturePromises);
          
          object.traverse((child) => {
            if (child instanceof Mesh) {
              const material = new MeshStandardMaterial();
              
              textures.forEach((textureUrl, index) => {
                const texture = loadedTextures[index];
                
                if (textureUrl.toLowerCase().includes('diffuse') || 
                    textureUrl.toLowerCase().includes('albedo') ||
                    textureUrl.toLowerCase().includes('basecolor') ||
                    textureUrl.toLowerCase().includes('color')) {
                  material.map = texture;
                } else if (textureUrl.toLowerCase().includes('normal')) {
                  material.normalMap = texture;
                  material.normalScale.set(1, 1);
                } else if (textureUrl.toLowerCase().includes('roughness')) {
                  material.roughnessMap = texture;
                  material.roughness = 1;
                } else if (textureUrl.toLowerCase().includes('metalness') || 
                           textureUrl.toLowerCase().includes('metallic')) {
                  material.metalnessMap = texture;
                  material.metalness = 1;
                } else if (textureUrl.toLowerCase().includes('ao') || 
                           textureUrl.toLowerCase().includes('ambient')) {
                  material.aoMap = texture;
                } else if (textureUrl.toLowerCase().includes('displacement') || 
                           textureUrl.toLowerCase().includes('height')) {
                  material.displacementMap = texture;
                  material.displacementScale = 0.1;
                } else {
                  material.map = texture;
                }
              });
              
              child.material = material;
            }
          });
        } catch (error) {
          console.error('Error loading textures:', error);
        }
      }
    });

    // Cleanup function
    return () => {
      if (groupRef.current) {
        groupRef.current.clear();
      }
    };
  }, [objUrl, materials, textures, loadTexture]);

  if (!model) return <Loader />;

  return <primitive ref={groupRef} object={model} />;
};

const OBJModelViewer: React.FC<OBJModelViewerProps> = ({ 
  objUrl, 
  mtlUrl, 
  textures = [],
  autoRotate = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);

  return (
    <div style={{ 
      width: isFullscreen ? '100vw' : '100%', 
      height: isFullscreen ? '100vh' : '500px',
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 9999 : 'auto',
      backgroundColor: '#1a1a1a'
    }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ background: '#2c2c2c' }}
        performance={performanceMode ? 'low' : 'high'}
        dpr={performanceMode ? 1 : window.devicePixelRatio}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Model 
          objUrl={objUrl} 
          mtlUrl={mtlUrl} 
          textures={textures} 
          autoRotate={autoRotate}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
        />
        <gridHelper args={[10, 10]} />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        
        <button
          onClick={() => setPerformanceMode(!performanceMode)}
          style={{
            padding: '8px 12px',
            backgroundColor: performanceMode ? '#4caf50' : 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {performanceMode ? 'High Quality' : 'Performance Mode'}
        </button>
      </div>
    </div>
  );
};

export default OBJModelViewer;