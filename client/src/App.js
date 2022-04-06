import "./App.css";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
// import React from "react";

const App = () => {
    React.useEffect(() => {
        WebFont.load({
            google: {
                families: ["Roboto", "Droid Sans", "Chilanka"],
            },
        });
    }, []);

    return ( <
        Router >
        <
        Header / >
        <
        Switch > { " " } <
        Route exact path = "/"
        component = { Home }
        />{" "} < /
        Switch > { " " } <
        Footer / >
        <
        /Router>
    );
};

export default App;