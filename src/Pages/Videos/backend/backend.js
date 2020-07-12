import firebase from '../../../firebase/firebase'
import touch from '../../../touch/touch'   //for nextSlide and prevSlide  !!!

class videoPage{
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
  }

  nextSlideForKeyInput(setCurrentItem, currentItem, length){
    const current = document.getElementById("outter-wrapper2")
    const next = document.getElementById("outter-wrapper3")
    current.style.left = "-100%"
    current.style.transition = "left 400ms ease-out"
    next.style.left = 0
    next.style.transition = "left 400ms ease-out"

    setTimeout(()=>{
      touch.nextSlide(setCurrentItem, currentItem, length)
      current.style.left = 0
      current.style.transition = "none"
      next.style.left = "100%"
      next.style.transition = "none"
    }, 400)

  }

  prevSlideForKeyInput(setCurrentItem, currentItem, length){
    const current = document.getElementById("outter-wrapper2")
    const prev = document.getElementById("outter-wrapper1")
    current.style.left = "100%"
    current.style.transition = "left 400ms ease-out"
    prev.style.left = 0
    prev.style.transition = "left 400ms ease-out"

    setTimeout(()=>{
      touch.prevSlide(setCurrentItem, currentItem, length)
      current.style.left = 0
      current.style.transition = "none"
      prev.style.left = "-100%"
      prev.style.transition = "none"
    }, 400)

  }

  loadVideos(loadVideoItems, setPostIDs, model){
    var starCountRef = firebase.db.ref(firebase.getCurrentUserId()+"/video/").orderByKey();
    starCountRef.on('value', function(snapshot) {
      var videoItems = [] //local temp variable
      snapshot.forEach(function (snapItem){
        if (snapItem.val().model===model || model==="all"){
          videoItems.push(snapItem.val())
        }
      });
      try{
        //uploading all post ids to the state
        var identificators = Object.keys(snapshot.val())
        setPostIDs(identificators)
      }catch (error){
        console.log(error.message)
      }
      //load json of all photos from database into redux state
      loadVideoItems(videoItems)
    });
  }

  fullScreenOff(setIsPlaying, setGlobalCurrentItem, isPlaying, indx, currentItem, disp){
    document.getElementById("video-slider").classList.remove("darken")
    setTimeout(()=>{
      document.getElementById("video-slider").classList.remove("active")
    }, 300)
    const container = document.getElementById("videoPlayer-container"+indx)
    console.log(container, indx)
    if (disp<0 || disp==undefined){
      console.log("slideUp")
      container.classList.add("slideUp")
    }else{
      console.log(disp)
      console.log("slideDown")
      container.classList.add("slideDown")
    }
    //document.getElementById("videoPlayer-container").classList.add("slideUp")
    //document.getElementById("outter-wrapper").classList.remove("active")
    //document.getElementById("videoPlayer-container").classList.add("closed")
    //execute after animation is finished
    setTimeout(()=>{
      setGlobalCurrentItem(currentItem)
      setIsPlaying(false)
    }, 750) //animation lasts for 450ms
  }

  handleSelectPhotos(setSelectedItems, selectedItems, target, index){
    console.log(target.parentNode.parentNode)
    if (target.parentNode.parentNode.classList.contains("selected")){ //cancel selected item
      var arr=[...selectedItems]
      const indx = arr.indexOf(index)
      arr.splice(indx, 1)
      setSelectedItems(arr)
    }else{   //add selected item
      setSelectedItems([...selectedItems, index])
    }
  }

  renderSelectedItems(videoItems, selectedItems){
    videoItems.forEach((item, i) => {
      const id = "videoPoster-container"+i
      const div = document.getElementById(id)
      div.classList.remove("selected")
    });
    console.log(selectedItems)
    selectedItems.forEach((item, i) => {
      const id = "videoPoster-container"+item
      const div = document.getElementById(id)
      div.classList.add("selected")
    });
  }

  handleDeleteFiles(setIsSelecting, selectedItems, postIDs, videoItems){
    console.log(selectedItems)
    selectedItems.forEach((item, i) => {
      console.log(postIDs[item])
      this.deleteUserFile(videoItems[item].name, videoItems[item].posterName, videoItems[item].model)
      this.deleteUrl(postIDs[item])
    });
    setIsSelecting(false)
  }

  deleteUrl(postId){
    firebase.db.ref(firebase.getCurrentUserId()+"/video/"+postId+"/").remove()
  }

  deleteUserFile(name, posterName, folder){
    console.log(name)
    // Create a reference to the file to delete
    var storageRef = firebase.storage.ref()
    var desertRef = storageRef.child(firebase.getCurrentUserId()+'/video/'+folder+"/"+name);

    // Delete the file
    desertRef.delete().then(function() {
      // File deleted successfully
      console.log("Success!")
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error.message)
    });

    var posterRef = storageRef.child(firebase.getCurrentUserId()+'/video/posters/'+posterName);
    posterRef.delete().then(function() {
      // File deleted successfully
      console.log("Success!")
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error.message)
    });
  }

}

export default new videoPage()
