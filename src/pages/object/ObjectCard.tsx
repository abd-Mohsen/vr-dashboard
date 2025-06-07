import { useState, useRef, useEffect } from "react";
import "./ObjectCard.scss";

interface ObjectCardProps {
  object: {
    id: string;
    name: string;
    thumbnail: string;
    description: string;
    lastUpdated: string;
    modelPath: string;
  };
  onView: () => void;
  onDelete: () => void;
}

export const ObjectCard = ({ object, onView, onDelete }: ObjectCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowDeleteDialog(false);
      }
    };

    if (showDeleteDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteDialog]);

  return (
    <div className="object-card">
      <div className="card-content" onClick={onView}>
        <div className="object-preview">
          {object.thumbnail ? (
            <img src={object.thumbnail} alt={object.name} />
          ) : (
            <div className="placeholder">No Preview Available</div>
          )}
        </div>
        <div className="object-info">
          <h3 className="title">{object.name}</h3>
          <h6 className="subtitle">{object.description}</h6>
        </div>
      </div>

      <div className="actions">
        <button className="view" onClick={onView}>
          View
        </button>
        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          ref={deleteButtonRef}
        >
          Delete
        </button>
      </div>

      {showDeleteDialog && (
        <div className="delete-dialog-overlay">
          <div 
            className="delete-dialog"
            ref={dialogRef}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{object.name}"?</p>
            <p>This action cannot be undone.</p>
            
            <div className="dialog-actions">
              <button onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowDeleteDialog(false);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};