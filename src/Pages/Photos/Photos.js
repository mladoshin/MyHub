import React, {useEffect, useState} from 'react';
import {withRouter, useParams} from 'react-router-dom';
import {connect} from 'react-redux'
//Importing the Components
import NavBar from '../../Components/NavBar/Navbar';
import PhotoViewer from './components/photoViewer/photoViewer'
import firebase from '../../firebase/firebase'
//importing the css file for the Photos page
import './Photos.css';
//import Gallery from './components/photoGallery/gallery'

import photoPage from './backend/backend'

function Photos(props) {
  let {userid} = useParams()
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const pageRange = 100
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isFullScreen, setIsFullScreen] = useState(null)
  const [postIDs, setPostIDs] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [currentGlobalItem, setCurrentGlobalItem]  = useState(0)

  useEffect(()=>{
    console.log(props.photos)
  })
  useEffect(()=>{
    //resetting the state after changing
    if (!isSelecting){
      setSelectedItems([])
    }
  }, [isSelecting])

  useEffect(()=>{
    scrollToImg(0)
  }, [currentPage])

  useEffect(()=>{
    //applying styles to the selected items
    //photoPage.renderSelectedItems(props.photos, currentPage, pageRange, selectedItems)
    console.log(selectedItems)
  }, [selectedItems])

  useEffect(()=>{
    let cleanup = false
    if (!isFirebaseInit) {
      try{
        firebase.isInit().then(val=>{
          userCheck()
          if (!cleanup){
            photoPage.loadPhotos(props.loadPhotoItems, setPostIDs)
          }
          console.log("loading photos")
          setIsFirebaseInit(true)

        })
      }catch(err){
        console.log(err.message)
      }

    }
    return ()=>cleanup=true
  }, [isFirebaseInit])

  function userCheck(){
    if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
      props.history.replace("/");
      return null
    }else if(userid!==firebase.getCurrentUserId()){
      props.history.replace("/404")
    }
  }

  useEffect(()=>{
    scrollToImg(currentGlobalItem)
  }, [currentGlobalItem])

  function scrollToImg(indx){
    const id = "image-container"+indx
    console.log(id)
    const img = document.getElementById(id)
    try{
      img.scrollIntoView({block: "center"})
    }catch (err){
      //error
    }
  }

  function handleClick(target, index, date, time){
    if (target.className==="info-btn"){
      //info button click
      alert("Name: "+props.photos[index].name+"\nDate: "+date+"\nTime: "+time)
      return 1
    }else if(!isSelecting){
      setIsFullScreen(index) //open fullscreen view
    }else{
      console.log("selected!")
      photoPage.handleSelectPhotos(setSelectedItems, selectedItems, currentPage, pageRange, target, index) //selecting files if the isSelected is true
    }
  }

  if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
    props.history.replace("/");
    return null
  }

  const images = props.photos.slice(currentPage*pageRange, currentPage*pageRange+pageRange).map((item, index)=>{
    const date = new Date(item.date).toLocaleDateString();
    const time = new Date(item.date).toLocaleTimeString()
    photoPage.renderSelectedItems(selectedItems, index)
      return(
        <div id={"image-container"+index} className="image-container" key={index} onClick={(e)=>handleClick(e.target, index, date, time)}>
          <img className="image" id={"picture"+index} src={item.url} loading="lazy" alt="image"/>
          <div className="meta-container" id={"meta-container"+index}>
            <h4>{item.name}</h4>
            <button className="info-btn">Info</button>
            <svg viewBox="0 0 16 16" className="bi bi-check-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
        </div>
      )
  })

  const gallery = isFullScreen!==null ? (
    <PhotoViewer photos={props.photos.slice(currentPage*pageRange, currentPage*pageRange+pageRange)} indx={isFullScreen} setIsFullScreen={setIsFullScreen} setCurrentItem={setCurrentGlobalItem}/>
  ):(
    <React.Fragment>
      <div id="grid" className="photo-grid">
        {images!==null ? images : <h2>No photos found</h2>}
      </div>

      <div className="pageControlContainer">
        <h3>Page: {currentPage+1}/{Math.ceil(props.photos.length/pageRange)}</h3>
        {currentPage>0 ? <button className="btn-page-switch" onClick={()=>photoPage.prevPage(setCurrentPage, currentPage)}>Back</button> : null}
        {(currentPage+1)*pageRange<props.photos.length ? <button className="btn-page-switch" onClick={()=>photoPage.nextPage(setCurrentPage, currentPage)}>Next</button> : null}
      </div>

      </React.Fragment>
  )

  const selectingComponent = isSelecting ? (
    <div>
      <button onClick={()=>{
        setSelectedItems([])
        setIsSelecting(false)}
      }>Exit Selecting</button>
      <button onClick={()=>{
        photoPage.handleDeleteFiles(setIsSelecting, selectedItems, postIDs, props.photos)}
      }>Delete Files</button>
    </div>
  )
  :
  (
    <button onClick={()=>{
      setIsSelecting(true)}
    }>Select Photos</button>
  )

  return (
    <div className="App">
      <NavBar model="AllModels" folder="photo"/>
      <div className="content-wrapper photo-wrapper" style={{display: isFirebaseInit ? "block" : "none"}}>
        <div>
          {selectingComponent}
        </div>
        {gallery}
      </div>
    </div>
  );

}


const mapStateToProps = state => {
  return {
    photos: state.photos
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    loadPhotoItems: (arr)=>dispatch({type: "PHOTO/LOAD", payload: arr})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Photos))
