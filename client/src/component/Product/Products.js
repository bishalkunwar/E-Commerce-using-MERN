import React from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useEffect } from "react";
import { Fragment } from "react";

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getProduct());
    }, [dispatch, error]);

    return ( <
        Fragment > { " " } {
            loading ? ( <
                Loader / >
            ) : ( <
                Fragment >
                <
                h2 className = "productsHeading" > All Products < /h2>{" "} <
                div className = "products" > { " " } {
                    products &&
                        products.map((product) => ( <
                            ProductCard key = { product._id }
                            product = { product }
                            />
                        ))
                } { " " } <
                /div>{" "} <
                /Fragment>
            )
        } { " " } <
        /Fragment>
    );
};

export default Products;