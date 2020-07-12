import React, {useEffect, useState} from 'react';
import {withRouter, useParams} from 'react-router-dom';
import { connect } from 'react-redux';

//Importing the Components
import NavBar from '../../Components/NavBar/Navbar';
import VideoGallery from './components/videoGallery';

//importing the css file for the Video page
import './Videos.css';
//BACKEND
import videoPage from './backend/backend'
import firebase from '../../firebase/firebase'


function Videos(props){
  let {model} = useParams();
  let {userid} = useParams();
  //let {folder} = useParams();
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [postIDs, setPostIDs] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [globalCurrentItem, setGlobalCurrentItem] = useState(0)

  useEffect(()=>{
    scrollToVid(globalCurrentItem)
  }, [globalCurrentItem])

  useEffect(()=>{
    console.log(isFirebaseInit)
    if (isFirebaseInit===true){
      //alert("videos loaded!")
    }
  })

  useEffect(()=>{
    //resetting the state after changing
    if (!isSelecting){
      setSelectedItems([])
    }
  }, [isSelecting])

  useEffect(()=>{
    //applying styles to the selected items
    videoPage.renderSelectedItems(props.videos, selectedItems)
  }, [selectedItems])

  useEffect(()=>{
    window.onload = ()=>console.log("Loaded")
    document.addEventListener('readystatechange', () => console.log(document.readyState));
  })

  function scrollToVid(indx){
    const id = "poster-outter-wrapper"+indx
    console.log(id)
    const vid = document.getElementById(id)
    try{
      vid.scrollIntoView({block: "center"})
    }catch (err){
      //error
    }
  }

  useEffect(()=>{
    if (!isFirebaseInit) {
      firebase.isInit().then(val=>{
        //console.log("loading items")
        videoPage.loadVideos(props.loadVideoItems, setPostIDs, model)
        userCheck()
      }).then(()=>setIsFirebaseInit(true))
    }
  }, [isFirebaseInit])

  function handleClick(target, index){
    if(!isSelecting){
      setIsPlaying(index) //open fullscreen view
    }else{
      console.log("selected!")
      videoPage.handleSelectPhotos(setSelectedItems, selectedItems, target, index) //selecting files if the isSelected is true
    }
  }
  //console.log(model)
  function userCheck(){
    if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
      props.history.replace("/");
      return null
    }else if(userid!==firebase.getCurrentUserId()){
      props.history.replace("/404")
    }
  }


  const video = props.videos.map((item, index)=>{
    console.log("Video Rendering")
      return(
        <div key={index} className="videoPoster-container" id={"videoPoster-container"+index} onClick={(e)=>handleClick(e.target, index)}>
          <div className="poster-outter-wrapper" id={"poster-outter-wrapper"+index} >
            <div className="playBtn-wrapper">
              <img src="https://image.flaticon.com/icons/svg/860/860780.svg" className="playBtn"/>
            </div>
            <img key={index} className="poster" id={"poster"+index} src={item.posterUrl} loading="lazy" alt="poster"/>
          </div>

          <div className="video-meta-info">
            <h5>{item.name}</h5>
          </div>
        </div>
      )
  })
  return(
    <div className="App">
      <NavBar model={model} folder="video"/>
      <div className="content-wrapper" style={{display: "block"}}>
        {model!=="all" ? <h1>Folder: {model}</h1> : <h1>All videos</h1>}
        {isSelecting ?
          <div>
            <button onClick={()=>{
              setSelectedItems([])
              setIsSelecting(false)}
            }>Exit Selecting</button>
            <button onClick={()=>{
              videoPage.handleDeleteFiles(setIsSelecting, selectedItems, postIDs, props.videos)}
            }>Delete Files</button>
          </div>
          :
          <button onClick={()=>{
            setIsSelecting(true)}
          }>Select Videos</button>
        }


        {isPlaying===false ? null : <VideoGallery setIsPlaying={setIsPlaying} videos={props.videos} setGlobalCurrentItem={setGlobalCurrentItem} isPlaying={isPlaying}/>}
        <div id="grid" className="video-grid">
          {video}
        </div>
      </div>
    </div>
  );

}

const mapStateToProps = state => {
  if (state.videos.length===0){
    return {
      videos: []
    }
  }
  return {
    videos: state.videos
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    loadVideoItems: (arr)=>dispatch({type: "VIDEO/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Videos));
