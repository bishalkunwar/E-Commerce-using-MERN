import React, {Fragment, useRef, useState} from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Loader from "../layout/Loader/Loader";
// import {useAlert} from "react-alert";
import { Link } from 'react-router-dom';
import "./LoginSignUp.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
// import { clearErrors } from '../../actions/productAction';

const LoginSignUp = () => {
  
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword]= useState("");

  const loginSubmit = ()=>{
    console.log("Form Submitted");
  };

  // const registerSubmit = ()=>{
  //   console.log("Form Submitted");
  // };

  const switchTabs=(e, tab)=>{
    if(tab==="login"){
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }

    if(tab==="register"){
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeitralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };
  
  return (

   
      <Fragment>
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e)=>switchTabs(e, "login")}>LOGIN</p>
              <p onClick={(e)=>switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
          <div className="loginEmail">
          <MailOutlineIcon/>
          <input type="email"
          placeholder="Email"
          required
          value={loginEmail}
          onChange={(e)=>setLoginEmail(e.target.value)} 
          
          />
          </div>

          <div className="loginPassword">
            <LockOpenIcon/>
            <input type="password" 
            placeholder="Password"
            required
            value={loginPassword}
            onChange={(e)=>setLoginPassword(e.target.value)}
            />
          </div>
          <Link to="/password/forgot">Forget Password?</Link>
          <input className="loginBtn" type="submit" value="Login" />
          </form>
        </div>
      </div>
    
    </Fragment>



    
  );
};

export default LoginSignUp;