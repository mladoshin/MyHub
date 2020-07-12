import photoViewer from '../Pages/Photos/backend/backend'
import videoViewer from '../Pages/Videos/backend/backend'

class touch{
  constructor(){
    this.displacement=0
    this.thresholdX = window.innerWidth/4
    this.thresholdY = window.innerHeight/4
    this.touchObj = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
    this.components = {
      prev: null,
      current: null,
      next: null,
      container: null
    }
  }

  //Move to separate slider controls folder-------------------------//
  nextSlide(setCurrentItem, currentItem, length){
      if (currentItem < length-1){
        setCurrentItem(currentItem+1)
      }else{
        setCurrentItem(0)
      }
  }

  prevSlide(setCurrentItem, currentItem, length){
    if (currentItem>0){
      setCurrentItem(currentItem-1)
    }else{
      setCurrentItem(length-1)
    }
  }
  //-------------------------------------------------//

  handleStart(ev, indx, type){
    this.components.prev = type=="photo" ? document.getElementById("image-container-prev") : document.getElementById("outter-wrapper1");
    this.components.current = type=="photo" ? document.getElementById("image-container-current") : document.getElementById("outter-wrapper2");  //
    this.components.next = type=="photo" ? document.getElementById("image-container-next") : document.getElementById("outter-wrapper3");
    this.components.container = type=="photo" ? document.getElementById("viewer-container") : document.getElementById("videoPlayer-container"+indx);

    //console.log(this.components.container, type, indx)

    this.touchObj.startX = ev.touches[0].clientX;
    this.touchObj.startY = ev.touches[0].clientY;
    this.touchObj.endX = ev.touches[0].clientX;
    this.touchObj.endY = ev.touches[0].clientY;
  }

  handleMove(ev, indx, type){
    if (document.fullscreenElement===null || type=="photo"){

      this.touchObj.endX = ev.touches[0].clientX;
      this.touchObj.endY = ev.touches[0].clientY;

      const displacementY = (this.touchObj.endY - this.touchObj.startY)
      const displacementX = (this.touchObj.endX - this.touchObj.startX)
      this.displacement = displacementY

      if (Math.abs(displacementY)>Math.abs(displacementX)){
        this.components.container.style.transition = "none"
        type=="photo" ? this.components.container.style.top = displacementY+"px" : this.components.container.style.marginTop = displacementY+"px";
        this.components.container.style.opacity = 1.0-Math.abs(displacementY)/500
      }else if(displacementX<0 && Math.abs(displacementX) > Math.abs(displacementY)){
        this.components.current.style.left = displacementX+"px"
        this.components.next.style.left = (window.innerWidth+displacementX)+"px"
      }else if(displacementX>0 && displacementX > Math.abs(displacementY)){
        this.components.current.style.left = displacementX+"px"
        this.components.prev.style.left = (-window.innerWidth+displacementX)+"px"
      }
    }
  }


  sliderLeftSwipe(setCurrentItem, currentItem, length){
    this.components.current.style.left = "-100%"
    this.components.next.style.left = "0px"
    this.components.current.style.transition = "left 300ms ease-out"
    this.components.next.style.transition = "left 300ms ease-out"
    setTimeout(()=>{
      this.components.current.style.left = "0px"
      this.components.next.style.left = "100%"
      this.components.current.style.transition = "none"
      this.components.next.style.transition = "none"
      this.nextSlide(setCurrentItem, currentItem, length)
    }, 300)
  }

  sliderRightSwipe(setCurrentItem, currentItem, length){
    this.components.current.style.left = "100%"
    this.components.prev.style.left = "0px"
    this.components.current.style.transition = "left 300ms ease-out"
    this.components.prev.style.transition = "left 300ms ease-out"
    setTimeout(()=>{
      this.components.current.style.left = "0px"
      this.components.prev.style.left = "-100%"
      this.components.current.style.transition = "none"
      this.components.prev.style.transition = "none"
      this.prevSlide(setCurrentItem, currentItem, length)
    }, 300)
  }

  sliderCancelRightSwipe(props){
    this.components.current.style.left = "0px"
    this.components.prev.style.left = "-100%"
    this.components.current.style.transition = "left 200ms ease-in-out"
    this.components.prev.style.transition = "left 200ms ease-in-out"
    setTimeout(()=>{
      this.components.current.style.transition = "none"
      this.components.prev.style.transition = "none"
    }, 200)
  }

  sliderCancelLeftSwipe(props){
    this.components.current.style.left = "0px"
    this.components.next.style.left = "100%"
    this.components.current.style.transition = "left 200ms ease-in-out"
    this.components.next.style.transition = "left 200ms ease-in-out"
    setTimeout(()=>{
      this.components.current.style.transition = "none"
      this.components.next.style.transition = "none"
    }, 200)
  }

  sliderCancelVertical(props){
    props.type == "photo" ? this.components.container.style.top = 0 : this.components.container.style.marginTop = 0;
    this.components.container.style.opacity = 1
    this.components.container.style.transition = "all 450ms ease-in-out"
    setTimeout(()=>{
      this.components.container.style.transition = "none"
    }, 450)
  }

  handleEnd(props){      //setIsPlaying, setGlobalCurrentItem, setCurrentItem, currentItem, isPlaying, indx, length
    var offsetX = this.touchObj.endX - this.touchObj.startX;
    var offsetY = this.touchObj.endY - this.touchObj.startY;
    console.log(props.indx)
    if (document.fullscreenElement===null || props.type=="photo"){

      if (offsetX*(-1) >= this.thresholdX){ //Left swipe
        this.sliderLeftSwipe(props.setCurrentItem, props.currentItem, props.length)
      }else if(offsetX >= this.thresholdX){ //Right swipe
        this.sliderRightSwipe(props.setCurrentItem, props.currentItem, props.length)
      }else if(offsetX*(-1) < this.thresholdX && offsetX*(-1)>=0){ //cancel sliding forward
        this.sliderCancelLeftSwipe()
      }else if(offsetX < this.thresholdX && offsetX > 0){ //cancel sliding backwards
        this.sliderCancelRightSwipe()
      }

      if (offsetY >= this.thresholdY || offsetY*(-1) >= this.thresholdY){
        this.components.container.classList.remove("opened")
        if (this.displacement<0){
          this.components.container.classList.add("slideUp")
        }else{
          this.components.container.classList.add("slideDown")
        }
        props.type=="photo" ? photoViewer.fullScreenOff(props.setIsFullScreen, props.setGlobalCurrentItem, props.currentItem, this.displacement) : videoViewer.fullScreenOff(props.setIsPlaying, props.setGlobalCurrentItem, props.isPlaying, props.indx, props.currentItem, this.displacement)
      }else{
        this.sliderCancelVertical({type: props.type})
      }


    }
  }



}

export default new touch();
