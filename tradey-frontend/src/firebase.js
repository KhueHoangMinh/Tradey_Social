import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAX_WcdBS8OfhXbCr1f6V57MvVItXgEjNo",
  authDomain: "tradey-c8115.firebaseapp.com",
  projectId: "tradey-c8115",
  storageBucket: "tradey-c8115.appspot.com",
  messagingSenderId: "798522501880",
  appId: "1:798522501880:web:cb2fdab026617c0598690d",
  measurementId: "G-EJ3JC41MZF"
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);