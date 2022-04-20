import React, {Fragment, useRef, useState} from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Loader from "../layout/Loader/Loader";
// import {useAlert} from "react-alert";
import { Link } from 'react-router-dom';
import "./LoginSignUp.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
// import profile from "../../images/Profile.png";
// import { clearErrors } from '../../actions/productAction';
// import { useEffect } from 'react';

const LoginSignUp = () => {
 
  // const dispatch = useDispatch();
  // const alert = useAlert();

  // const {error, loading}=useSelector((state)=>state.user);

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword]= useState("");

    const [user, setUser]= useState({
      name:"", email:"", password:"",
    });

  const {name, email, password}= user;

  const [avatar, setAvatar]= useState();
  const [avatarPreview, setAvatarPreview]= useState("../../images/Profile.png");

  const loginSubmit = ()=>{
    console.log("Login Form Submitted");
  };

  const registerSubmit = (e)=>{
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    console.log("Sign Up Form Submitted");
  };


  const registerDataChange =(e)=>{
    if(e.target.name==="avatar"){
      const reader= new FileReader();

      reader.onload=()=>{
        if(reader.readyState===2){
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.targer.files[0]);
    }else{
      setUser({...user, [e.target.name]:e.target.value});
    }
  };

  // useEffect(()=>{
  //   if(error){
  //     alert.error(error);
  //     dispatch(clearErrors);
  //   }
  // }, [dispatch, error, alert,]);

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

      registerTab.current.classList.add("shiftToNeutralForm");
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

          <form className="signUpForm" ref={registerTab} encType="multipart/form-data" onSubmit={registerSubmit}>
            <div className="signUpName">
              <FaceIcon/>
              <input type="text" placeholder="Name" 
              required
              name="name"
              value={name}
              onChange={registerDataChange}
              />
            </div>

            <div className="signUpEmail">
                <MailOutlineIcon/>
                <input type="email" 
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={registerDataChange}
                />
            </div>
            
            <div className="signUpPassword">
              <LockOpenIcon/>
              <input type="password" placeholder="Password" required name={password} value={password} onChange={registerDataChange} />
            </div>
            
            <div className="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input type="file" name="avatar" accept="image/*" onChange={registerDataChange}/>
            </div>

            <input type="submit" value="register" className="signUpBtn" />

          </form>
        </div>
      </div>
    
    </Fragment>)
    
 
};

export default LoginSignUp;