import React, {useEffect, useState} from 'react'
import videoPage from '../backend/backend'
import touch from '../../../touch/touch'
import keyInput from '../../../keyInput/keyInput'
import './videoPlayer.css'

export default function VideoPlayer(props){
  const poster = props.videoItem.posterUrl
  const url = props.videoItem.url
  const name = props.videoItem.name
  const date = new Date(props.videoItem.date).toLocaleDateString();
  const time = new Date(props.videoItem.date).toLocaleTimeString();
  const duration = props.videoItem.duration
  const lastModified = new Date(props.videoItem.lastModified_date).toLocaleDateString();
  const type = props.videoItem.type
  const size = props.videoItem.size/1024/1024

  useEffect(()=>{
    document.getElementById("videoPlayer-container"+props.indx).ontouchstart = (e)=>touch.handleStart(e, props.indx, "video")
    document.getElementById("videoPlayer-container"+props.indx).ontouchend = (e)=>touch.handleEnd({setIsPlaying: props.setIsPlaying, setIsFullScreen: props.setIsFullScreen, setCurrentItem: props.setCurrentItem, setGlobalCurrentItem: props.setCurrentItem, currentItem: props.currentItem, length: props.length, indx: props.indx, type: "video"})
    document.getElementById("videoPlayer-container"+props.indx).ontouchmove = (e)=>touch.handleMove(e, props.currentItem, "video")
    document.onkeyup = (e)=>keyInput.handleKeyInput({setCurrentItem: props.setCurrentItem, setIsFullScreen: props.setIsFullScreen, setIsPlaying: props.setIsPlaying, setGlobalCurrentItem: props.setGlobalCurrentItem, keyCode: e.keyCode, currentItem: props.currentItem, indx: props.indx, length: props.length, page: "video"})

    //document.getElementById("outter-wrapper").classList.add("active")
    //document.getElementById("videoPlayer-container").classList.add("opened")
  })

  return(
    <div className={"outter-wrapper "+props.className} id={"outter-wrapper"+props.indx}>
      <div className="videoPlayer-container" id={"videoPlayer-container"+props.indx}>
        <div className="mobile-meta-data">
          <h5>{name}</h5>
        </div>
        <video src={url} controls="controls" poster={poster}/>
        <div className="video-meta-data">
          <h5>Type: {type}</h5>
          <h5>Name: {name}</h5>
          <h5>Duration: {duration.toFixed(0)} sec.</h5>
          <h5>Size: {size.toFixed(1)} MB</h5>
          <h5>Upload Date: {date}</h5>
          <h5>Upload Time: {time}</h5>
          <h5>Last Modified: {lastModified}</h5>
        </div>
      </div>
    </div>

  )
}
