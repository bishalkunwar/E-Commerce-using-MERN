import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { getProduct, clearErrors } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

// const product = {
//     name: "Blue Tshirt",
//     images: [{ url: "https://i.ibb.co/DRST11n/1.webp" }],
//     price: "RS.5000",
//     _id: "Bishal",
// }; loading, error,, productsCount

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="BishalMart" />
          <div className="banner">
            <p> Welcome to Bishal Mart </p>{" "}
            <h1> ** * FIND AWESOME PRODUCTS BELOW ** * </h1>{" "}
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>{" "}
            </a>{" "}
          </div>{" "}
          <h2 className="homeHeading"> Featured Products </h2>{" "}
          <div className="container" id="container">
            {" "}
            {products &&
              products.map((product) => <ProductCard product={product} />)}{" "}
          </div>{" "}
        </Fragment>
      )}{" "}
    </Fragment>
  );
};

export default Home;
