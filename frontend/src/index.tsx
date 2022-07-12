import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter , Routes  } from 'react-router-dom';
import Home from './pages/Home';
// import { Context } from './context/SocketContext';
// import Main from './pages/Main';
import User from "./components/User"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
 
  
  <BrowserRouter>
 <Routes>
  <Route path='/' element={<Home/>} />
 

  <Route path='room/:roomId' element={ <User/>} />




 </Routes>
</BrowserRouter>




);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
