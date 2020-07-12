import React, {useState} from 'react';
import {NavLink, withRouter} from'react-router-dom'
import '../../App.css';
import './authForm.css'
import '../../Pages/RegPage/reg.css'
import firebase from '../../firebase/firebase'

function AuthForm(props){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return(
    <div className="App">
      <form className="auth-window">
      <div className="inner">
        <h1>Login</h1>
        <input id="logInp" type="login" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
        <input id="passInp" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
        <button onClick={(e) => login(e, props, email, password)}>Log in</button>
      </div>
      </form>
      <NavLink to="/signup">Don't have an account? Create a new one</NavLink>
    </div>
  );
}

async function login(e, props, email, password) {
    e.preventDefault()

    try {
      await firebase.login(email, password)
      sessionStorage.setItem("Auth", true)
      props.history.replace("/home/userId="+firebase.getCurrentUserId())
    } catch(error) {
      alert(error.message)
    }
  }


export default withRouter(AuthForm);
