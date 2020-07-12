import React from 'react'

import AuthForm from './Components/AuthForm/AuthForm';
import HomePage from './Pages/HomePage/HomePage';
import NoMatchPage from './Pages/404Page/NoMatchPage';
import UploadPage from './Pages/UploadPage/uploadPage';
import Photos from './Pages/Photos/Photos';
import Videos from './Pages/Videos/Videos';
import RegPage from './Pages/RegPage/reg';
import SettingsPage from './Pages/SettingsPage/settings';
import {BrowserRouter, Route, Switch} from "react-router-dom";
//const MyContext = React.createContext();


function App(props) {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => (<AuthForm/>)}/>
          <Route path="/home/userId=:userid" render={() => (<HomePage/>)}/>
          <Route path="/photo/userId=:userid" render={() => (<Photos/>)}/>
          <Route path="/video/userId=:userid/:model" render={() => (<Videos/>)}/>
          <Route exact path="/signup" render={() => (<RegPage/>)}/>
          <Route exact path="/settings/userId=:userid" render={() => (<SettingsPage/>)}/>
          <Route exact path="/uploads/userId=:userid/:folder/:model" render={() => (<UploadPage/>)}/>
          <Route component={NoMatchPage}/>
        </Switch>
      </BrowserRouter>
    );
}

export default App;
//export {MyContext};
