import { useRef, useState } from "react";
import "./ObjectCard.scss";

interface ObjectCardProps {
  object: {
    id: string;
    name: string;
    thumbnail: string;
    description: string;
    lastUpdated: string;
    modelPath: string;
    hidden?: boolean;
  };
  onView: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onVisibilityChange?: (id: string, hidden: boolean) => void; // Optional callback for parent
}

export const ObjectCard = ({ object, onView, onEdit, onDelete, onVisibilityChange }: ObjectCardProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isHidden, setIsHidden] = useState(object.hidden || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dialogRef.current?.showModal();
  };

  const confirmDelete = () => {
    dialogRef.current?.close();
    onDelete(object.id);
  };

  const handleToggleHidden = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newHiddenState = e.target.checked;
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('scene_id', localStorage["selectedLayoutId"]);
      formDataToSend.append('hidden', newHiddenState.toString());

      const response = await fetch(`http://localhost:8000/api/models/${object.id}/visibility`, {
        method: 'PATCH',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body: formDataToSend,
      });
      
      if (response.ok) {
        setIsHidden(newHiddenState);
        // Notify parent component if callback provided
        onVisibilityChange?.(object.id, newHiddenState);
      } else {
        // Revert the checkbox if the request failed
        e.target.checked = !newHiddenState;
        console.error('Failed to toggle visibility:', await response.text());
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      e.target.checked = !newHiddenState;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="object-card">
      <div className="card-content" onClick={onView}>
        <div className="object-preview">
          {object.thumbnail ? (
            <img src={object.thumbnail} alt={object.name} />
          ) : (
            <div className="placeholder">No Preview Available</div>
          )}
          {isHidden && (
            <div className="hidden-overlay">
              <span>HIDDEN</span>
            </div>
          )}
        </div>
        <div className="object-info">
          <h3 className="title">{object.name}</h3>
          <h6 className="subtitle" style={{ whiteSpace: 'pre-line' }}>
            {object.description}
          </h6>
          {/* {isHidden && (
            <div className="hidden-badge">
              Hidden from search
            </div>
          )} */}
        </div>
      </div>

      <div className="actions">
        <button className="view" onClick={onEdit}>
          Edit
        </button>
        <button className="delete" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>

      <div className="visibility-toggle">
        <label>
          <input
            type="checkbox"
            checked={isHidden}
            onChange={handleToggleHidden}
            disabled={isLoading}
          />
          {isLoading ? "Updating..." : "Hide from scene"}
        </label>
      </div>

      <dialog ref={dialogRef} className="native-dialog">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete "{object.name}"?</p>
        <p>This action cannot be undone.</p>
        <div>
          <button onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button onClick={confirmDelete} className="delete-button">
            Delete
          </button>
        </div>
      </dialog>
    </div>
  );
};