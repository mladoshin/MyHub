import firebase from '../../../firebase/firebase'
import touch from '../../../touch/touch' //for nextSlide() and prevSlide() !!!

class photoPage{
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

  deleteUrl(postId){
    firebase.db.ref(firebase.getCurrentUserId()+"/photo/"+postId+"/").remove()
  }

  deleteUserFile(name){
    console.log(name)
    // Create a reference to the file to delete
    var storageRef = firebase.storage.ref()
    var desertRef = storageRef.child(firebase.getCurrentUserId()+'/photo/'+name);

    // Delete the file
    desertRef.delete().then(function() {
      // File deleted successfully
      console.log("Success!")
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error.message)
    });

  }

  handleDeleteFiles(setIsSelecting, selectedItems, postIDs, photoItems){
    console.log(selectedItems)
    selectedItems.forEach((item, i) => {
      console.log(postIDs[item])
      this.deleteUrl(postIDs[item])
      this.deleteUserFile(photoItems[item].name)
    });
    setIsSelecting(false)
  }

  nextPage(setCurrentPage, currentPage){
    setCurrentPage(currentPage+1)
  }

  prevPage(setCurrentPage, currentPage){
    setCurrentPage(currentPage-1)
  }

  prevSlideForKeyInput(setCurrentItem, currentItem, length){
    const current = document.getElementById("image-container-current")  //
    const prev = document.getElementById("image-container-prev")  //
    current.classList.add("right-slide-current")
    prev.classList.add("right-slide-prev")
    setTimeout(()=>{
      touch.prevSlide(setCurrentItem, currentItem, length)
      current.classList.remove("right-slide-current")
      prev.classList.remove("right-slide-prev")
    }, 300)

  }
  nextSlideForKeyInput(setCurrentItem, currentItem, length){
    const current = document.getElementById("image-container-current")  //
    const next = document.getElementById("image-container-next")  //
    current.classList.add("left-slide-current")
    next.classList.add("left-slide-next")
    setTimeout(()=>{
      touch.nextSlide(setCurrentItem, currentItem, length)
      current.classList.remove("left-slide-current")
      next.classList.remove("left-slide-next")
    }, 300)
  }

  fullScreenOn(setIsFullScreen, currentItem){
    setIsFullScreen(currentItem)
  }

  fullScreenOff(setIsFullScreen, setGlobalCurrentItem, currentItem, disp){
    document.getElementById("viewer-container").classList.remove("opened")
    if (disp<0){
      document.getElementById("viewer-container").classList.add("slideUp")
    }else{
      document.getElementById("viewer-container").classList.add("slideDown")
    }

    //execute after animation is finished
    setTimeout(()=>{
      setIsFullScreen(null)
      setGlobalCurrentItem(currentItem)
    }, 400) //animation lasts for 450ms
  }

  handleSelectPhotos(setSelectedItems, selectedItems, currentPage, pageRange, target, index){
    if (target.parentNode.classList.contains("selected")){
      var arr=[...selectedItems]
      const indx = arr.indexOf(index)
      arr.splice(indx, 1)
      setSelectedItems(arr)
    }else{
      setSelectedItems([...selectedItems, (currentPage*pageRange)+index])
    }
  }

  renderSelectedItems(photoItems, currentPage, pageRange, selectedItems){
    photoItems.slice(currentPage*pageRange, currentPage*pageRange+pageRange).forEach((item, i) => {
      const id = "image-container"+i
      const div = document.getElementById(id)
      div.classList.remove("selected")
    });
    console.log(selectedItems)
    selectedItems.forEach((item, i) => {
      const localIndx = item-(currentPage*pageRange)
      const id = "image-container"+localIndx
      const div = document.getElementById(id)
      div.classList.add("selected")
    });
  }

  loadPhotos(loadPhotoItems, setPostIDs){
    var starCountRef = firebase.db.ref(firebase.getCurrentUserId()+"/photo/").orderByChild("date");
    starCountRef.on('value', function(snapshot) {
      var videoItems = [] //local temp variable
      snapshot.forEach(function (snapItem){
        videoItems.push(snapItem.val())
      });
      try{
        //uploading all post ids to the state
        var identificators = Object.keys(snapshot.val())
        setPostIDs(identificators)
      }catch (error){
        console.log(error.message)
      }
      //load json of all photos from database into redux state
      loadPhotoItems(videoItems.reverse())
    });
  }

}

export default new photoPage()
