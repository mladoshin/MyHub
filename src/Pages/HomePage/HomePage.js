import React, {useEffect, useState} from 'react';
import {withRouter, useParams} from 'react-router-dom';
import {connect} from 'react-redux'
import firebase from '../../firebase/firebase'

//Importing the Components
import NavBar from '../../Components/NavBar/Navbar';
import UserInfo from '../../Components/UserInfo-griditem/UserInfo';

//importing the css file for the Home Page
import './HomePage.css';

function HomePage(props){
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  let {userid} = useParams()

  useEffect(()=>{
    if (!isFirebaseInit) {
      firebase.isInit().then(val=>{
        userCheck()
        loadUserInfoFromDB()
      }).then(()=>setIsFirebaseInit(true))
    }
  }, [isFirebaseInit])

  useEffect(()=>{
    console.log(props.userInfo)
  })

  function loadUserInfoFromDB(){
    var starCountRef = firebase.db.ref(firebase.getCurrentUserId()+"/user-info/");
    starCountRef.on('value', function(snapshot) {
      //load json of all photos from database into redux state
      props.loadUserInfo(snapshot.val())
    });
  }


  function userCheck(){
    if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
      props.history.replace("/");
      return null
    }else if(userid!==firebase.getCurrentUserId()){
      props.history.replace("/404")
    }
  }


  return(
    <React.Fragment>
      <NavBar/>
      <div id="content-wrapper" className="content-wrapper" style={{marginTop: '50px'}}>
        <UserInfo style={{visibility: isFirebaseInit ? "visible" : "none"}} userInfo={props.userInfo}/>
        <div className="item" style={{gridColumn: "2/4"}}>left aside section</div>

        <div className="item" style={{gridColumn: "4/12"}}>Main central section</div>
        <div className="item" style={{gridColumn: "2/12"}}>Footer</div>

      </div>
    </React.Fragment>
  );
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));
