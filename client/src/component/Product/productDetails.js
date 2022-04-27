import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, clearErrors } from "../../actions/productAction";
import {addItemsToCart} from "../../actions/cartAction";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  // useEffect(() => {
  //     if (error) {
  //         alert.error(error);
  //         dispatch(clearErrors());
  //     }
  //     dispatch(getProductDetails(match.params.id));
  // }, [dispatch, match.params.id, error, alert]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      return;
    }
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) {
      return;
    }
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler=()=>{
      dispatch(addItemsToCart(match.params.id, quantity));
      alert.success("Item Added To Cart");
  };


  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    // if(success){
    //     alert.success("Review Submitted Successfully.");
    //     dispatch({})
    // }

    dispatch(getProductDetails(match.params.id));
  }, [dispatch, error, alert, match.params.id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Product Details"/>
          <div className="ProductDetails">
            <div>
              <Carousel>
                {" "}
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}{" "}
              </Carousel>{" "}
            </div>{" "}
            <div>
              <div className="detailsBlock-1">
                <h2> {product.name} </h2> <p> Product# {product._id} </p>{" "}
              </div>{" "}
              <div className="detailsBlock-2">
                <ReactStars {...options} />{" "}
                <span>
                  {" "}
                  ({product.numOfReviews}
                  Reviews){" "}
                </span>{" "}
              </div>{" "}
              <div className="detailsBlock-3">
                <h1> {`Rs.${product.price}`} </h1>{" "}
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}> - </button>
                     <input readonly value={quantity} type="number" />
                    <button onClick={increaseQuantity}> + </button>{" "}
                  </div>{" "}
                  <button disabled={product.Stock<1?true:false} onClick={addToCartHandler}> Add to Cart </button>{" "}
                </div>{" "}
                <p>
                  Status:{" "}
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {" "}
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}{" "}
                  </b>{" "}
                </p>{" "}
              </div>{" "}
              <div className="detailsBlock-4">
                Description: <p> {product.description} </p>{" "}
              </div>{" "}
              <button className="submitReview"> Submit Review </button>{" "}
            </div>{" "}
          </div>{" "}
          <h3 className="reviewsHeading"> REVIEWS </h3>{" "}
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {" "}
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard review={review} />
                ))}{" "}
            </div>
          ) : (
            <p className="noReviews"> No Reviews Yet </p>
          )}{" "}
        </Fragment>
      )}{" "}
    </Fragment>
  );
};

export default ProductDetails;
