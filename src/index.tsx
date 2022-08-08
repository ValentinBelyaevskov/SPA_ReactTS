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
import { BrowserRouter } from 'react-router-dom';

// init backendless
Backendless.serverURL = "https://eu-api.backendless.com"
Backendless.initApp("295120EE-E24B-4A50-FF24-926233392A00", "CCC12612-0E70-441B-A845-8E60848C726F")

ReactDOM.render(
   <React.StrictMode>
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
               <App />
            </BrowserRouter>
         </PersistGate>
      </Provider>
   </React.StrictMode>,
   document.getElementById('root')
);

reportWebVitals();