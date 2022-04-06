import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import Product from "./Product";
import MetaData from "../layout/MetaData";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";

const product = {
    name: "Blue Tshirt",
    images: [{ url: "https://i.ibb.co/DRST11n/1.webp" }],
    price: "RS.5000",
    _id: "Bishal",
};

const Home = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    return ( <
        Fragment >
        <
        MetaData title = "BishalMart" / >
        <
        div className = "banner" >
        <
        p > Welcome to Bishal Mart < /p>{" "} <
        h1 > ** * FIND AWESOME PRODUCTS BELOW ** * < /h1>{" "} <
        a href = "#container" >
        <
        button >
        Scroll < CgMouse / >
        <
        /button>{" "} < /
        a > { " " } <
        /div>{" "} <
        h2 className = "homeHeading" > Featured Products < /h2>{" "} <
        div className = "container"
        id = "container" >
        <
        Product product = { product }
        /> <Product product={product} / > { " " } <
        Product product = { product }
        /> <Product product={product} / > { " " } <
        Product product = { product }
        /> <Product product={product} / > { " " } <
        /div>{" "} < /
        Fragment >
    );
};

export default Home;

// <div className="container" id="container">
//         {" "}
//         {products &&
//           products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}{" "}
//       </div>{" "}