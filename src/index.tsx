import './nullstyle.scss'
import './vars.scss'
import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import Backendless from 'backendless'
import { persistor, store } from 'redux/store';

// init backendless
// Backendless.serverURL = "https://plummypeace.backendless.app"
Backendless.initApp("8285D161-C472-5C58-FF8F-DA6A40F66600", "5CDD4FCE-C1CE-4C00-BA20-901A456A10F2")

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <App />
         </PersistGate>
      </Provider>
   </React.StrictMode>,
   document.getElementById('root')
);

reportWebVitals();