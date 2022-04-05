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
Backendless.initApp("A61B4FCE-2976-8AE0-FFAA-F678297C5B00", "9A38A26E-D1EF-4883-B778-35017ED7C0C6")

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