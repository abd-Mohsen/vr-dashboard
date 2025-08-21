import { useState } from 'react'
import { ModelViewer } from './ModelViewer'
import './ObjectDetailsPopup.scss'

export function ObjectDetailsPopup({ 
  object: model, 
  onClose 
}: { 
  object: {
    name: string
    description: string
    lastUpdated: string
    thumbnail: string
    modelPath: string
  }
  onClose: () => void 
}) {
  return (
    <div className="popup-overlay">
      <div className="model-popup">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="object-popup-content">
          <div className="model-viewer-container">
            <ModelViewer modelPath={model.modelPath} />
          </div>
          
          <div className="model-info">
            <h2>{model.name}</h2>
            <br />
            <br />
            <div className="info-section">
              <h3>Description</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{model.description}</p>
            </div>
            <div className="info-section">
              <h3>Last Updated</h3>
              <p>{new Date(model.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div className="info-section">
              <h3>Model Type</h3>
              <p>{model.modelPath.split('?')[0].split('.').pop()?.toUpperCase()}</p>
            </div>
            <button 
              className="download-button"
              onClick={() => window.open(model.modelPath, '_blank')}
            >
              Download 3D Model
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}