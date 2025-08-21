import { useEffect, useState } from "react";
import OptionsMenu from "../OptionsMenu";
import logoIcon from "../../assets/vr-glasses.svg";
import "./navbar.scss";

const Navbar = () => {
  const [selectedLayoutName, setSelectedLayoutName] = useState<string | null>(
    localStorage.getItem("selectedLayoutName")
  );

  useEffect(() => {
    const updateSelectedLayout = () => {
      setSelectedLayoutName(localStorage.getItem("selectedLayoutName"));
    };

    // Listen for layout changes and deletions
    window.addEventListener("layoutChanged", updateSelectedLayout);

    return () => {
      window.removeEventListener("layoutChanged", updateSelectedLayout);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="logo">
        <img
          src={logoIcon}
          alt="VR glasses icon"
          style={{ width: "40px", height: "40px" }}
        />
        <span>VR dashboard</span>
      </div>

      <div className="icons">
        {selectedLayoutName ? (
          <span className="selected-layout-label">{selectedLayoutName}</span>
        ) : (
          <span className="no-layout-selected">No layout selected</span>
        )}
        <OptionsMenu />
      </div>
    </div>
  );
};

export default Navbar;
