import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import configureStore from './store';

import App from './App';
import { BrowserRouter } from 'react-router-dom'
import './index.css';


ReactDOM.render((
    <Provider store={configureStore()}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById("root"))