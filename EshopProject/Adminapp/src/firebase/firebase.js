import firebase from 'firebase/app'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyAH_mashdIxej3GG15lg8h72Aboo91CXYI",
    authDomain: "retirement-cal.firebaseapp.com",
    databaseURL: "https://retirement-cal.firebaseio.com",
    projectId: "retirement-cal",
    storageBucket: "retirement-cal.appspot.com",
    messagingSenderId: "253083084191",
    appId: "1:253083084191:web:05fc8c2b34df67029bc9aa"
  };

  firebase.initializeApp(config);

  const storage = firebase.storage()

  export  {
    storage, firebase as default
  }
