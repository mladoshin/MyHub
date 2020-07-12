function checkUser(login, password){

  if(login==localStorage.getItem("login") && password==localStorage.getItem("password")){
    sessionStorage.setItem("Auth", true);
    window.history.pushState(null, "Home", "/home");
    return true;
  }else if(!localStorage.getItem("login") && !localStorage.getItem("password") && login!=="" && password!==""){
    alert("It seems you don't have an account. We are creating a new one...");
    localStorage.setItem("login", login);
    localStorage.setItem("password", password);
    return true;
  }else if(login=="" || password==""){
    alert("The password and login value can't be empty");
  }
  sessionStorage.setItem("Auth", false);
  return false;

}
export default checkUser;
