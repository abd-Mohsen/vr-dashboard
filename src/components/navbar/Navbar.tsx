import OptionsMenu from "../OptionsMenu";
import logoIcon from "../../assets/vr-glasses.svg";
import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img 
          src={logoIcon}
          alt="VR glasses icon" 
          style={{ width: '40px', height: '40px' }} 
        />
        <span>VR dashboard</span>
      </div>
      <div className="icons">
        {/* <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div> */}
        {/* <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>Jane</span>
        </div> */}
        {/* <img src="/settings.svg" alt="" className="icon"
         onClick={
          () => console.log("press")
         }/> */}
         <OptionsMenu/>
      </div>
    </div>
  );
};

export default Navbar;
