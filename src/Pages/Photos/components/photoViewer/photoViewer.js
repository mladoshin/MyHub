import React, {useState, useEffect} from 'react'
import './photoViewer.css'
import photoPage from '../../backend/backend'
import touch from '../../../../touch/touch'
import keyInput from '../../../../keyInput/keyInput'

export default function PhotoViewer(props){
  const photos = props.photos
  const [currentItem, setCurrentItem]  = useState(props.indx)

  useEffect(()=>{
    photoPage.fullScreenOn(props.setIsFullScreen, currentItem)
  }, [])


  useEffect(()=>{
    document.getElementById("viewer-container").ontouchstart = (e)=>touch.handleStart(e, currentItem, "photo")
    document.getElementById("viewer-container").ontouchend = (e)=>touch.handleEnd({setIsFullScreen: props.setIsFullScreen, setCurrentItem: setCurrentItem, setGlobalCurrentItem: props.setCurrentItem, currentItem: currentItem, length: photos.length, type: "photo"})
    document.getElementById("viewer-container").ontouchmove = (e)=>touch.handleMove(e, currentItem, "photo")
    document.onkeyup = (e)=>keyInput.handleKeyInput({setCurrentItem: setCurrentItem, setIsFullScreen: props.setIsFullScreen, setGlobalCurrentItem: props.setCurrentItem, keyCode: e.keyCode, currentItem: currentItem, length: photos.length, page: "photo"})
  })


    return(
      <div id="viewer-container" className="viewer-container opened" style={{height: window.innerHeight}}>
        <div id="image-container-prev" className="img-container prev">
          <img src={photos[currentItem-1 < 0 ? props.photos.length-1 : currentItem-1].url} id="img-prev" alt="prev" className="image prev"/>
        </div>
        <div id="image-container-current" className="img-container current">
          <img src={photos[currentItem].url} id="img-current" alt="current" className="image"/>
        </div>
        <div id="image-container-next" className="img-container next">
          <img src={photos[currentItem+1>props.photos.length-1 ? 0 : currentItem+1].url} id="img-next" alt="next" className="image next"/>
        </div>
      </div>
    )


}
