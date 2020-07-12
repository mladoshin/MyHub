import photoViewer from '../Pages/Photos/backend/backend'
import videoViewer from '../Pages/Videos/backend/backend'

class keyInput{
  constructor(){

  }

  handleKeyInput(props){
    if (props.keyCode===39){   //Right arrow
      props.page=="photo" ? photoViewer.nextSlideForKeyInput(props.setCurrentItem, props.currentItem, props.length) : videoViewer.nextSlideForKeyInput(props.setCurrentItem, props.currentItem, props.length)
    }else if(props.keyCode===37){ //Left arrow
      props.page=="photo" ? photoViewer.prevSlideForKeyInput(props.setCurrentItem, props.currentItem, props.length) : videoViewer.prevSlideForKeyInput(props.setCurrentItem, props.currentItem, props.length)
    }else if(props.keyCode===27){ //esc
      try{
        props.page=="photo" ? photoViewer.fullScreenOff(props.setIsFullScreen, props.setGlobalCurrentItem, props.currentItem) : videoViewer.fullScreenOff(props.setIsPlaying, props.setGlobalCurrentItem, props.isPlaying, props.indx, props.currentItem, props.disp);    // setIsPlaying, setGlobalCurrentItem, isPlaying, indx, currentItem, disp
      }catch(err){}
    }
  }

}

export default new keyInput();
