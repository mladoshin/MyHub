import firebase from '../../../firebase/firebase'

class navbar{
  loadVideoFolders(setFolders){
    var starCountRef = firebase.db.ref(firebase.getCurrentUserId()+"/video/").orderByKey();
    starCountRef.on('value', function(snapshot) {
      var allFolders = [] //local temp variable
      snapshot.forEach(function (snapItem){
        if (snapItem.val().model!=="all"){
          allFolders.push(snapItem.val().model)
        }

      });
      const uniqueFolders = Array.from(new Set(allFolders))

      setFolders(uniqueFolders)
    });
  }
}

export default new navbar()
