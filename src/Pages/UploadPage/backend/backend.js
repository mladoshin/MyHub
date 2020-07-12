import firebase from '../../../firebase/firebase'

class uploadPage{
  constructor(){
    this.poster = null
    this.alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    this.uploadsCompleted = 0
  }

  loadPhotoUrls(loadPhotoItems, setPostIDs){
    var starCountRef = firebase.db.ref("photos/").orderByKey();
    starCountRef.on('value', function(snapshot) {
      var photoItems = [] //local temp variable
      snapshot.forEach(function (snapItem){
        photoItems.push(snapItem.val())
      });
      try{
        //uploading all post ids to the state
        var identificators = Object.keys(snapshot.val())
        setPostIDs(identificators)
      }catch (error){
        console.log(error.message)
      }
      //load json of all photos from database into redux state
      loadPhotoItems(photoItems)
    });
  }

  generateRandomName(maxLength){
    var name = ""
    for (let i=0; i<maxLength; i++){
      name+=this.alphabet[Math.floor(Math.random() * this.alphabet.length)]
    }
    return name
  }

  extractVideoFrame(file, videoName, videoUrl, model, fileType, lm_date, size){
    console.log(fileType, lm_date, size)
    const vid = document.createElement("video")
    vid.src=URL.createObjectURL(file)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    vid.onloadedmetadata = ()=>{
      canvas.width = vid.videoWidth
      canvas.height = vid.videoHeight
      vid.currentTime=Math.random()*vid.duration
      vid.onseeked = ()=>{
        ctx.drawImage(vid, 0, 0)
        //const img = document.createElement("img")
        const posterName = this.generateRandomName(10)
        canvas.toBlob((blob)=>this.uploadVideoPosterToStorage(videoName, videoUrl, blob, posterName, model, fileType, lm_date, size, vid.duration),"image/jpeg", 0.5)
      }
    }
  }

  uploadVideoPosterToStorage(fileName, url, poster, posterName, model, fileType, lm_date, size, videoDuration){
    console.log(poster)
      const uploadTask = firebase.storage.ref(firebase.getCurrentUserId()+"/video/posters/"+posterName).put(poster)
      uploadTask.on("state_changed",
        snapshot => {

        },
        error=>{
          //errror function
          console.log(error.message)
        },
        ()=>{
          firebase.storage
            .ref(firebase.getCurrentUserId()+"/video/posters/")
            .child(posterName)
            .getDownloadURL()
            .then(posterUrl=>{
              this.pushVideoDataToDatabase(fileName, url, posterUrl, model, fileType, lm_date, size, videoDuration, posterName)
            })
        }
      )
  }

  pushVideoDataToDatabase(name, url, posterUrl, model, fileType, lm_date, size, videoDuration, posterName){
    firebase.db.ref(firebase.getCurrentUserId()+"/video/").push({
      name: name,
      type: fileType,
      url: url,
      model: model,
      posterUrl: posterUrl,
      posterName: posterName,
      date: Date.now(),
      lastModified_date: lm_date,
      size: size,
      duration: videoDuration
    });
  }

  pushPhotoDataToDatabase(name, url, fileType, lm_date, size){
    var dbRef = firebase.db.ref(firebase.getCurrentUserId()+"/photo/").push({
      name: name,
      type: fileType,
      url: url,
      date: Date.now(),
      lastModified_date: lm_date,
      size: size
    });

    console.log(dbRef.key)
  }

  handleUpload(goToPath, e, files, folder, model, fileNames){
    console.log(fileNames)
    this.uploadsCompleted=0
    e.preventDefault()
    //alert the message if the user hasn't chosen any files to upload
    const folderRef = folder=="video" ? firebase.getCurrentUserId()+"/"+folder+"/"+model+"/" : firebase.getCurrentUserId()+"/photo/"
    if (files.length===0){
      alert("Choose some files!")
      return 0
    }

    for (let i=0;i<files.length;i++){

      if (fileNames.indexOf(files[i].name)+1){  //if filename already exist move on to the next file
        alert("File "+files[i].name+" already exists!")
        const id = "progress"+i
        const progressBlock = document.getElementById(id)
        progressBlock.classList.add("error")
        progressBlock.innerHTML="The same file alredy exist!"
        this.uploadsCompleted++
        continue
      }

      const uploadTask = firebase.storage.ref(folderRef+files[i].name).put(files[i])
      uploadTask.on("state_changed",
        snapshot => {
          const progress = uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes

          //update the progress values
          const id = "progress"+i
          const progressBar = document.getElementById(id)
          console.log(progressBar)
          try{
            progressBar.style.width=progress*100+"%"
            progressBar.innerHTML = Math.round(progress*100)+"%"
          }catch (error){
            console.log(error)
          }
        },
        error=>{
          //errror function
          console.log(error.message)
        },
        ()=>{
          firebase.storage
            .ref(folderRef)
            .child(files[i].name)
            .getDownloadURL()
            .then(url=>{
              switch (folder){
                case "video":
                  console.log(files[i].type)
                  this.extractVideoFrame(files[i], files[i].name, url, model, files[i].type, files[i].lastModified, files[i].size)
                  break;
                case "photo":
                  this.pushPhotoDataToDatabase(files[i].name, url, files[i].type, files[i].lastModified, files[i].size)
                  break;
                default:
                  console.log(folder)
              }

            })
          this.uploadsCompleted++
          const id = "upload-block"+i
          const progressBlock = document.getElementById(id)
          progressBlock.classList.add("closedBlock")
          setTimeout(()=>{
            progressBlock.style.display="none"
          }, 600)
          if (this.uploadsCompleted===files.length){
            //goToPath("/"+folder+"/userId="+firebase.getCurrentUserId()+"/"+model)
            setTimeout(()=>{
              window.location = "/"+folder+"/userId="+firebase.getCurrentUserId()+"/"+model
            }, 1000)
          }
        }
      )
    }
  }
}

export default new uploadPage()
