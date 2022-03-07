import './nullstyle.scss'
import './vars.scss'
import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store';
import Backendless from 'backendless'

// init backendless
Backendless.serverURL = "https://eu-api.backendless.com"
Backendless.initApp("E2470674-1C5E-D549-FFFA-A5346A974000", "78A034E0-01B7-4D9C-9F1D-D141F5EF2335")

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