import React from 'react';
import OBJModelViewer from './OBJModelViewer';


const TestOBJ = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>3D Model Viewer</h1>
      <OBJModelViewer
        objUrl="/models/myModel.obj"
        mtlUrl="/models/myModel.mtl"
        textures={['/models/texture_1001.exr']}
        autoRotate={false} // Disable auto-rotation to save CPU
      />
    </div>
  );
};

export default TestOBJ;