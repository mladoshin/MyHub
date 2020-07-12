import React, {useEffect, useState} from 'react';
import {withRouter, useParams} from 'react-router-dom'
import {connect} from 'react-redux'
import './uploadPage.css';
import firebase from '../../firebase/firebase'
import  NavBar from '../../Components/NavBar/Navbar'

//BACKEND
import uploadPage from './backend/backend'

function UploadPage(props) {
  const [isFirebaseInit, setIsFirebaseInit] = useState(false)
  const [files, setFiles] = useState([])
  const [fileNames, setFileNames] = useState([])
  const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false)
  let {model} = useParams();
  let {folder} = useParams();
  let {userid} = useParams();

  if (model==="posters"){
    alert("posters is the system folder. You can't use it!")
    props.history.replace("/"+folder+"/all")
  }

  useEffect(()=>{
    var arr = []
    firebase.isInit().then(val=>{
      userCheck()
      setIsFirebaseInit(val)
    })
    if (folder=="video"){
      props.videos.forEach((item, i) => {
        arr.push(item.name)
      });
      setFileNames(arr)
    }else if(folder=="photo"){
      props.photos.forEach((item, i) => {
        arr.push(item.name)
      });
      setFileNames(arr)
    }


  }, [])

  function userCheck(){
    if (sessionStorage.getItem("Auth")=="false" && !firebase.getCurrentUserName()){
      props.history.replace("/");
      return null
    }else if(userid!==firebase.getCurrentUserId()){
      props.history.replace("/404")
    }
  }

  const progressBars = files.map((item, index)=>{
    return(
      <div id={"upload-block"+index} className="upload-block" key={index}>
        <div className="filename-container">
          <h5>{item.name}</h5>
        </div>
        <div className="progress" id={"progressOutter"+index}>
          <div id={"progress"+index} className="progress-bar" role="progressbar" style={{width: "0%"}}>0%</div>
        </div>
      </div>
    )
  })

  return (
    <div className="App">
      <NavBar folder="videos"/>
      <div style={{marginTop: '50px'}}>
        <h1>Folder: {model}</h1>
        <div style={{marginTop: 20, marginBottom: 20}}>
          {!isCreatingNewFolder ?
            <button onClick={(e)=>setIsCreatingNewFolder(true)}>Create Folder</button>
          :
            <React.Fragment>
              <button onClick={(e)=>setIsCreatingNewFolder(false)}>Cancel</button>
              <input id="folderInput" placeholder="Enter the folder name"/>
              <button onClick={()=>handleCreateFolder()}>Create</button>
            </React.Fragment>
          }
        </div>
        {model!=="all" ?
        <form className="uploadForm" style={{visibility: isFirebaseInit ? "visible" : "none"}}>
          <input id="fileInput" type="file" multiple onChange={(e)=>handleChange(e)}/>
          <button onClick={(e)=>uploadPage.handleUpload(props.history.replace, e, files, folder, model, fileNames)}>Upload</button>
          <div id="progressContainer">
            {progressBars}
          </div>
        </form>
        :
        null
        }

      </div>

    </div>
  );

  function handleChange(e){
    const files = e.target.files
    console.log(files[0])
    setFiles([...files])
  }

  function handleCreateFolder(){
    const folderName = document.getElementById("folderInput").value
    if (folderName.length !== 0){
      setIsCreatingNewFolder(false)
      props.history.replace("/uploads/userId="+firebase.getCurrentUserId()+"/"+folder+"/"+folderName)
    }
  }

}
const mapStateToProps = state => {
  return {
    videos: state.videos,
    photos: state.photos
  }
}
export default connect(mapStateToProps, null)(withRouter(UploadPage))
