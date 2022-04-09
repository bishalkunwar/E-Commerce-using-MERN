import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
// import { options } from "../../server/routes/productRoute";
const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE,
};

// const root = ReactDOM.createRoot(documet.getElementById("root"));
// root.render( < App / > );

ReactDOM.render( <
    Provider store = { store } >
    <
    AlertProvider template = { AlertTemplate } {...options } >
    <
    App / >

    <
    /AlertProvider>

    <
    /Provider>,
    document.getElementById("root")
);