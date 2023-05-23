import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css'
import { Provider } from 'react-redux';
import store from './store'
import io from 'socket.io-client'

// window.baseHost = 'https://tradey-387014.el.r.appspot.com/'
window.baseHost = 'http://192.168.1.7:3001/'

window.host = window.baseHost

window.socket = null
if(!window.socket) window.socket = io.connect(window.baseHost, 
  {
    // path: "/tradey-backend/us-central1/server/socket.io",
    withCredentials: true,
    // extraHeaders: {
    //   "my-custom-header": "abcd"
    // }
  }
)
console.log(window.socket)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
