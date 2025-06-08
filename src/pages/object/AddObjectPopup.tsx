import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import './addObjectPopup.scss';

interface ObjectFormData {
  name: string;
  description: string;
  thumbnail: File | null;
  modelFile: File | null;
  thumbnailPreview: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  modelPath: string;
}

export function AddObjectPopup({ onClose, onAdd, model }: { 
  onClose: () => void;
  onAdd: (formData: FormData, modelId?: string) => Promise<void>;
  model?: Model | null;
}) {
  const [formData, setFormData] = useState<ObjectFormData>({
    name: '',
    description: '',
    thumbnail: null,
    modelFile: null,
    thumbnailPreview: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(model);
    if (model) {
      setFormData(prev => ({
        ...prev,
        name: model.name,
        description: model.description,
        thumbnailPreview: model.thumbnail
      }));
      //console.log(formData);
    }
  }, [model]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleModelChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        modelFile: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!formData.modelFile && !model)) return;

    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    
    // Always append thumbnail if it exists, even if null (to allow removal)
    if (formData.thumbnail || (model && !formData.thumbnailPreview)) {
        formDataToSend.append('thumbnail', formData.thumbnail || new Blob());
    }
    
    // Always append model if it exists
    if (formData.modelFile) {
        formDataToSend.append('model', formData.modelFile);
  }

    try {
      await onAdd(formDataToSend, model?.id);
      onClose();
    } catch (error) {
      console.error('Error adding model:', error);
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className="popup-overlay">
      <div className="add-model-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{model ? 'Edit 3D Model' : 'Add New 3D Model'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Object Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="file-upload-group">
            <div className="thumbnail-upload">
              <label>Thumbnail Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                hidden
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="upload-button"
              >
                Choose Thumbnail
              </button>
              {formData.thumbnailPreview && (
                <div className="thumbnail-preview">
                  <img src={formData.thumbnailPreview} alt="Thumbnail preview" />
                </div>
              )}
              {formData.thumbnail && (
                <div className="file-info">{formData.thumbnail.name}</div>
              )}
            </div>

            <div className="model-upload">
              <label>3D Model File</label>
              <input
                type="file"
                ref={modelInputRef}
                onChange={handleModelChange}
                accept=".glb,.gltf,.fbx,.obj"
                hidden
                required={!model}
              />
              <button 
                type="button" 
                onClick={() => modelInputRef.current?.click()}
                className="upload-button"
              >
                Choose 3D Model
              </button>
              {formData.modelFile && (
                <div className="file-info">{formData.modelFile.name}</div>
              )}
              {model && !formData.modelFile && (
                <div className="file-info">Current model will be kept</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !formData.name || (!formData.modelFile && !model)}
            >
              {isLoading ? 'Saving...' : model ? 'Save Changes' : 'Add Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}