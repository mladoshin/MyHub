import React, {useState, useEffect} from 'react'
import VideoPlayer from './videoPlayer'
import videoPage from '../backend/backend'
import './videoGallery.css'
export default function VideoGallery(props){ //props: videos (ARRAY), isPlaying, setIsPlaying, setGlobalCurrentItem
  const [currentItem, setCurrentItem]  = useState(props.isPlaying)
  const prevItem = props.videos[currentItem>0 ? currentItem-1 : props.videos.length-1]
  const curItem = props.videos[currentItem]
  const nextItem = props.videos[currentItem<props.videos.length-1 ? currentItem+1 : 0]

  useEffect(()=>{
    //document.getElementById("video-slider").ontouchstart = (e)=>videoPage.handleStart(e)
    //document.getElementById("videoPlayer-container").ontouchend = (e)=>videoPage.handleEnd(e, props.setIsPlaying, props.setGlobalCurrentItem, props.isPlaying)
    //document.getElementById("videoPlayer-container").ontouchmove = (e)=>videoPage.handleMove(e)
    document.getElementById("video-slider").classList.add("active")
    setTimeout(()=>{
      document.getElementById("video-slider").classList.add("darken")
    }, 450)
  }, [])

  return(
    <div style={{position: "absolute", display: "flex", flexDirection: "row", left: 0, width: "100%", height: "100%", overflow: "hidden"}} className="video-slider" id="video-slider">
      <VideoPlayer videoItem={prevItem} setIsPlaying={props.setIsPlaying} setCurrentItem={setCurrentItem} currentItem={currentItem} setGlobalCurrentItem={props.setGlobalCurrentItem} isPlaying={props.isPlaying} className="prev" indx={1} length={props.videos.length}/>
      <VideoPlayer videoItem={curItem} setIsPlaying={props.setIsPlaying} setCurrentItem={setCurrentItem} currentItem={currentItem} setGlobalCurrentItem={props.setGlobalCurrentItem} isPlaying={props.isPlaying} className="current" indx={2} length={props.videos.length}/>
      <VideoPlayer videoItem={nextItem} setIsPlaying={props.setIsPlaying} setCurrentItem={setCurrentItem} currentItem={currentItem} setGlobalCurrentItem={props.setGlobalCurrentItem} isPlaying={props.isPlaying} className="next" indx={3} length={props.videos.length}/>
    </div>
  )
}
