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
Backendless.serverURL = "https://eu-api.backendless.com"
Backendless.initApp("837EDF4A-701E-9063-FF9A-9D9A531C0F00", "ABF9732D-F93A-4B95-8043-287F51F76589")

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