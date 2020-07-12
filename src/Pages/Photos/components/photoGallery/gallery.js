import React, {useState, useEffect} from 'react'
import PhotoViewer from '../photoViewer/photoViewer'
import photoPage from '../../backend/backend'

export default function Gallery(props){
  const [currentPage, setCurrentPage] = useState(0)
  const [currentGlobalItem, setCurrentGlobalItem]  = useState(0)
  const pageRange = 100;
  const [isFullScreen, setIsFullScreen] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(()=>{
    //resetting the state after changing
    if (!isSelecting){
      setSelectedItems([])
    }
  }, [isSelecting])

  useEffect(()=>{
    console.log("currentGlobalItem: "+currentGlobalItem)
  })

  useEffect(()=>{
    //applying styles to the selected items
    console.log(selectedItems)
    photoPage.renderSelectedItems(props.photos, currentPage, pageRange, selectedItems)
  }, [selectedItems])

  const selectingComponent = isSelecting ? (
    <div>
      <button onClick={()=>{
        setSelectedItems([])
        setIsSelecting(false)}
      }>Exit Selecting</button>
      <button onClick={()=>{

        console.log(props.photos)
        alert("")
        photoPage.handleDeleteFiles(setIsSelecting, selectedItems, props.postIDs, props.photos)}
      }>Delete Files</button>
    </div>
  )
  :
  (
    <button onClick={()=>{
      setIsSelecting(true)}
    }>Select Photos</button>
  )

  const images = props.photos.map((item, index)=>{
    const date = new Date(item.date).toLocaleDateString();
    const time = new Date(item.date).toLocaleTimeString()

      return(
        <div id={"image-container"+index} className="image-container" key={index} onClick={(e)=>handleClick(e.target, index, date, time)}>
          <img className="image" id={"picture"+index} src={item.url} loading="lazy" alt="image"/>
          <div className="meta-container">
            <h4>{item.name}</h4>
            <button className="info-btn">Info</button>
          </div>
        </div>
      )
  })

  function handleClick(target, index, date, time){
    console.log("isSelecting: "+isSelecting)
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

  if (isFullScreen!==null){
    return(
      <PhotoViewer photos={props.photos.slice(currentPage*pageRange, currentPage*pageRange+pageRange)} indx={isFullScreen} setIsFullScreen={setIsFullScreen} setCurrentItem={setCurrentGlobalItem}/>
    )
  }else{
    return(
      <React.Fragment>
        <div>
          {selectingComponent}
        </div>
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
  }
}
