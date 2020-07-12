import React from 'react';
import './UserInfo.css';


function UserInfo(props){
  const bdate = props.userInfo.birthday !== "N/A" ? new Date(props.userInfo.birthday).toDateString() : null
  return(
    <div className="item user-info">
      <div className="item avatar-container" >Avatar</div>
      <div className="main-user-info item">
        <h2>{props.userInfo.name}</h2>
        {props.userInfo.bio !== "N/A" ? <h3>Bio: {props.userInfo.bio}</h3> : null}
      </div>
      <div className="UserInfo item">
        {props.userInfo.birthday !== "N/A" ? <h3>Birthday: {bdate}</h3> : null}
        {props.userInfo.address !== "N/A" ? <h3>Address: {props.userInfo.address}</h3> : null}
        {props.userInfo.mobile_num !== "N/A" ? <h3>Mobile number: {props.userInfo.mobile_num}</h3> : null}
      </div>
      <div className="item" style={{gridColumn: "6/9", gridRow: "2/5"}}></div>
    </div>
  );
}


export default UserInfo;
