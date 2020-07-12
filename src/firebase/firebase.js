import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyCUc4BsCBqoFWIikL_KNRjJlLMhPnGflaA",
  authDomain: "myhub-7cd51.firebaseapp.com",
  databaseURL: "https://myhub-7cd51.firebaseio.com",
  projectId: "myhub-7cd51",
  storageBucket: "myhub-7cd51.appspot.com",
  messagingSenderId: "450491594273",
  appId: "1:450491594273:web:b7889df870061f17609560"
};


class Firebase{
    constructor(){
      app.initializeApp(firebaseConfig);
      this.auth = app.auth()
      this.storage = app.storage()
      this.db = app.database()
    }
    login(email, password){
      return this.auth.signInWithEmailAndPassword(email, password)
    }
    logout(){
      return this.auth.signOut()
    }
    async register(name, email, password){
      await this.auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        const user = app.auth().currentUser;
        user.sendEmailVerification();
      })
      return this.auth.currentUser.updateProfile({
        displayName: name,
        userEmail: email
      })
    }
    getCurrentUserName(){
      return this.auth.currentUser && this.auth.currentUser.displayName
    }
    getCurrentUserId(){
      return this.auth.currentUser && this.auth.currentUser.uid
    }
    isInit(){
      return new Promise(resolve=>{
        this.auth.onAuthStateChanged(resolve)
      })
    }
    resetUserPassword(email){
      var actionCodeSettings = {
        url: 'https://myhub-7cd51.web.app/?email=' + email
      };
      //this.logout()
      this.auth.sendPasswordResetEmail(email).then(()=>this.redirect(email)).catch(function(error) {
        alert(error.message)
        // An error happened.
      });
    }

    redirect(email){
      this.logout()
      sessionStorage.setItem("Auth", false)
      window.location.reload()
      if(email.indexOf("@mail.ru")+1){
        window.open("https://e.mail.ru/inbox")
      }else if(email.indexOf("@gmail.com")+1){
        window.open("https://mail.google.com/mail")
      }else if(email.indexOf("@yandex.ru")+1){
        window.open("https://mail.yandex.ru/")
      }
      console.log("email sent")
    }


  }

export default new Firebase()
