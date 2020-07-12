import React, {useState, useEffect} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from "react-redux"
import firebase from '../../firebase/firebase'
import './Navbar.css';
import navbar from './backend/backend'

function NavBar(props){
  const [folders, setFolders] = useState([])
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const model = props.model
  const folder = props.folder

  useEffect(()=>{
    if (!isFirebaseInit) {
      firebase.isInit().then(val=>{
        //console.log("loading items")
        navbar.loadVideoFolders(setFolders)
        setIsFirebaseInit(true)
      })
    }
  }, [isFirebaseInit])


  useEffect(()=>{
    //console.log(folders)
  })

  const folderLinkItems = folders.map((name, i)=>{
    //console.log(name)
    return (
      <a className="dropdown-item" key={i} style={{cursor: "pointer"}} onClick={()=>{
        //props.history.replace("/video/"+name)
        //window.location.reload()
        window.location = "/video/userId="+firebase.getCurrentUserId()+"/"+name
      }}>{name}</a>
    )
  })

  const uploadBtn = model!==undefined ? (
    <li className="nav-item">
      <NavLink to={"/uploads/userId="+firebase.getCurrentUserId()+"/"+folder+"/"+model}>Upload</NavLink>
    </li>
  ) : null
  return(
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="navbar-brand">
          <NavLink to={"/home/userId="+firebase.getCurrentUserId()}>MyHub</NavLink>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to={"/photo/userId="+firebase.getCurrentUserId()}>Photos</NavLink>
            </li>
            <li className="nav-item">
              <a style={{cursor: "pointer"}}onClick={()=>{
                window.location = "/video/userId="+firebase.getCurrentUserId()+"/all"
                //props.history.replace("/video/all")
                //window.location.reload()
              }}>Videos</a>
            </li>
            <li className="dropdown nav-item">
              <a className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Folders
              </a>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {folderLinkItems.length !== 0 ? folderLinkItems : <span>No folders yet</span>}
              </div>
            </li>
            {uploadBtn}
            <li className="nav-item">
              <a className="dropdown-btn" style={{cursor: "pointer"}} onClick={()=>logOut(props)}>Log out</a>
            </li>
          </ul>
        </div>
        <NavLink to={"/settings/userId="+firebase.getCurrentUserId()} className="settings-icon">
          <img src="https://firebasestorage.googleapis.com/v0/b/redux-test-2-65a8d.appspot.com/o/settings.svg?alt=media&token=9d7e281e-a5bb-40c0-a4a5-8da78bbeef47" style={{width: 32}}/>
        </NavLink>
      </nav>
    </header>
  );
}

function logOut(props){
  firebase.logout()
  sessionStorage.setItem("Auth", false)
  props.history.replace("/")
}

const mapStateToProps = state => {
  var folderItems = []
  state.videos.forEach((item, i) => {
    folderItems.push(item.model)
  });
  const uniqueFolders = Array.from(new Set(folderItems))
  console.log(uniqueFolders)
  console.log(state.videos)
  return {
    videoFolders: uniqueFolders
  }
}
export default connect(mapStateToProps, null)(withRouter(NavBar));
