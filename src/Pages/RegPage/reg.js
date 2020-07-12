import React, {useState} from 'react'
import {withRouter} from 'react-router-dom'
//import NavBar from '../../Components/NavBar/Navbar';
import firebase from '../../firebase/firebase'
import './reg.css'

function RegPage(props){
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return(
    <div className="App">

      <div className="auth-window" id="auth-window">
        <button className="btn-close" onClick={()=>props.history.replace("/")}>X</button>
          <div className="inner">
            <h1>Sign up</h1>
            <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
            <input placeholder="Login" value={email} onChange={e=>setEmail(e.target.value)}/>
            <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <button onClick={(e)=>onRegister(e, props, name, email, password)}>Sign up</button>
          </div>
      </div>

    </div>
  )
}

function putUserDataToDB(props){
  //console.log(props.geo.country)
  var dbRef = firebase.db.ref(firebase.getCurrentUserId()+"/user-info").set({
    name: props.name,
    email: props.email,
    mobile_num: props.mobile_num,
    address: props.address,
    birthday: props.birthday,
    bio: props.bio,
    avatarUrl: props.avatarUrl
  });
  getUserData().then((geo)=>{
    console.log(geo)
    firebase.db.ref(firebase.getCurrentUserId()+"/user-info/geolocation").set({
      country: geo.country,
      countryCode: geo.countryCode,
      regionName: geo.regionName,
      city: geo.city,
      zip: geo.zip,
      lat: geo.lat,
      lon: geo.lon,
      timezone: geo.timezone,
      org: geo.org,
      ip: geo.query
    })
  })

}

async function getUserData(){
    let response = await fetch("http://ip-api.com/json/")
    const json = await response.json()
    return json
}

async function onRegister(e, props, name, email, password){
  e.preventDefault()
  try{
    await firebase.register(name, email, password).then(()=>putUserDataToDB({name: name, email: email, mobile_num: "N/A", address: "N/A", birthday: "N/A", bio: "N/A", avatarUrl: "N/A"}))
    sessionStorage.setItem("Auth", true)
    alert("You have successfully registered! Congrats!")
    props.history.replace("/home/userId="+firebase.getCurrentUserId())
  }catch (error){
    //alert(error.message)
    console.log(error.message)
  }
}

export default withRouter(RegPage)
