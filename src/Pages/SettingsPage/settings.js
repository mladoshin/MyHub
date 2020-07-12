import React, {useEffect, useState} from 'react';
import {withRouter, useParams} from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../../firebase/firebase'

//Importing the Components
import NavBar from '../../Components/NavBar/Navbar';

//importing the css file for the Home Page
import './settings.css';

function SettingsPage(props){
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const [currentWindow, setCurrentWindow] = useState("general")

  let {userid} = useParams()

  useEffect(()=>{
    if (!isFirebaseInit) {
      firebase.isInit().then(val=>{
        userCheck()
        loadUserInfoFromDB()
      }).then(()=>setIsFirebaseInit(true))
    }
  }, [isFirebaseInit])

  function userCheck(){
    if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
      props.history.replace("/");
      return null
    }else if(userid!==firebase.getCurrentUserId()){
      props.history.replace("/404")
    }
  }

  function loadUserInfoFromDB(){
    var starCountRef = firebase.db.ref(firebase.getCurrentUserId()+"/user-info/");
    starCountRef.on('value', function(snapshot) {
      console.log(snapshot.val())
      //load json of all photos from database into redux state
      //setName(snapshot.val().name)
      //setBirthday(snapshot.val().birthday)
      //setAddress(snapshot.val().address)
      //setTel(snapshot.val().mobile_num)
      //setBio(snapshot.val().bio)
      props.loadUserInfo(snapshot.val())
    });
  }

  function MainSection(){
    if(currentWindow=="general"){
      return(<GeneralWindow/>)
    }else if(currentWindow=="profile"){
      return(<ProfileWindow info={props.userInfo}/>)
    }else if(currentWindow=="security"){
      return(<SecurityWindow/>)
    }else if(currentWindow=="privacy"){
      return(<PrivacyWindow/>)
    }
  }

  function PrivacyWindow(){
    return(
      <React.Fragment>
        <h2>Privacy Settings</h2>
        <span>Still working...</span>
      </React.Fragment>
    )
  }

  function SecurityWindow(){
    return(
      <React.Fragment>
        <h2>Security Settings</h2>
        <div className="security-flexbox">
          <div>
            <input type="email" id="email-inp" placeholder="Enter your e-mail"/>
            <button onClick={()=>{
              if (document.getElementById("email-inp").value==props.userInfo.email){
                firebase.resetUserPassword(document.getElementById("email-inp").value)
              }else{
                alert("Incorrect E-mail")
              }

            }}>Reset Password</button>
          </div>
        </div>

      </React.Fragment>
    )
  }

  function ProfileWindow(props){
    const [name, setName] = useState(props.info.name)
    const [birthday, setBirthday] = useState(props.info.birthday)
    const [address, setAddress] = useState(props.info.address)
    const [tel, setTel] = useState(props.info.mobile_num)
    const [bio, setBio] = useState(props.info.bio)
    return(
      <React.Fragment>
        <h2>Profile Settings</h2>
        <div className="profile-grid">
            <label htmlFor="name">Name: </label>
            <input name="name" value={name} onChange={(e)=>setName(e.target.value)}/>

            <label htmlFor="birthday">Birthday: </label>
            <input type="date" name="birthday" value={birthday !== "N/A" ? birthday : ""} onChange={(e)=>setBirthday(e.target.value)}/>

            <label htmlFor="address">Address: </label>
            <input type="text" name="address" value={address !== "N/A" ? address : ""} onChange={(e)=>setAddress(e.target.value)}/>

            <label htmlFor="mobile">Mobile: </label>
            <input type="tel" name="mobile" value={tel !== "N/A" ? tel : ""} onChange={(e)=>setTel(e.target.value)}/>

            <label htmlFor="bio">Bio: </label>
            <input type="text" name="bio" value={bio !== "N/A" ? bio : ""} onChange={(e)=>setBio(e.target.value)}/>
            <div>
              <button className="save-btn-profile" onClick={()=>handleUpdateInfo(name, tel, address, birthday, bio)}>Save</button>
            </div>

        </div>
      </React.Fragment>

    )
  }

  function GeneralWindow(){
    return(
      <React.Fragment>
        <h2>General Settings</h2>
        <span>Still working...</span>
      </React.Fragment>
    )
  }
  return(
    <React.Fragment>
      <NavBar/>
      <div className="wrapper" style={{position: "absolute", width: "100%", height: "calc(100% - 63px)", display: "flex", alignItems: "center", justifyContent: "center", }}>
        <div className="setting-window">
          <div className="left-side-menu">
            <div onClick={()=>setCurrentWindow("general")} className={currentWindow=="general" ? "active" : null}><span>General</span></div>
            <div onClick={()=>setCurrentWindow("profile")} className={currentWindow=="profile" ? "active" : null}><span>Profile</span></div>
            <div onClick={()=>setCurrentWindow("security")} className={currentWindow=="security" ? "active" : null}><span>Security</span></div>
            <div onClick={()=>setCurrentWindow("privacy")} className={currentWindow=="privacy" ? "active" : null}><span>Privacy</span></div>
          </div>

          <div className="settings-right-section">
            <MainSection/>
          </div>

        </div>
      </div>

    </React.Fragment>
  );


}

function handleUpdateInfo(name, tel, address, birthday, bio){
  var dbRef = firebase.db.ref(firebase.getCurrentUserId()+"/user-info").set({
    name: name,
    mobile_num: tel,
    address: address,
    birthday: birthday,
    bio: bio
  });
}


const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    loadUserInfo: (obj)=>dispatch({type: "USER/LOADINFO", payload: obj})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SettingsPage));
