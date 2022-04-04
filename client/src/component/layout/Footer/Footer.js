import React from "react";
import playStore from "../../../images/playStore.png";
import appStore from "../../../images/appStore.png";
import "./Footer.css";

const Footer = () => {
    return ( <
        footer id = "footer" >
        <
        div className = "leftFooter" >
        <
        h4 > Download Our App < /h4>{" "} <
        p > Download app
        for Android and IOS mobile phone. < /p>{" "} <
        img src = { playStore }
        alt = "playstore" / >
        <
        img src = { appStore }
        alt = "appStore" / >
        <
        /div> <
        div className = "midFooter" >
        <
        h1 > Bishal Mart < /h1> <p> High Quality is Priored majorly. </p > { " " } <
        p > Copyright 2022 & copy; Bishal < /p>{" "} < /
        div > <
        div className = "rightFooter" >
        <
        h4 > Follow Us < /h4>{" "} <
        a href = "http://facebook.com/beesal.sk" > Facebook < /a>{" "} <
        a href = "http://instagram.com/beesalsk/" > Instagram < /a> < /
        div > { " " } <
        /footer>
    );
};

export default Footer;