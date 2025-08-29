import React, { type ChangeEvent } from "react";
import type { Parameters } from "../types/Parameters";
import "../pages/generate/GeneratePage.scss";

interface ParametersPanelProps {
  params: Parameters;
  onChange: (name: keyof Parameters, value: string | boolean) => void;
}

const ParametersPanel: React.FC<ParametersPanelProps> = ({ params, onChange }) => {
  return (
    <div className="parameters-panel">
      <h3>Parameters</h3>

      <div className="param">
        <label>
          <input
            type="checkbox"
            checked={params.checkbox1}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange("checkbox1", e.target.checked)
            }
          />
          remove background
        </label>
      </div>

  
      <div className="param">
        <label>quality:</label>
        <select
          value={params.dropdown1}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange("dropdown1", e.target.value)
          }
        >
          {/* <option value="">Select...</option> */}
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="param">
        <label>model type:</label>
        <select
          value={params.dropdown2}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onChange("dropdown2", e.target.value)
          }
        >
          {/* <option value="">Select...</option> */}
          <option value="obj">OBJ</option>
          <option value="glb">GLB</option>
        </select>
      </div>
    </div>
  );
};

export default ParametersPanel;
