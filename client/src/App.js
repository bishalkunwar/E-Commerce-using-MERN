import "./App.css";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import Products from "./component/Product/Products.js";
import ProductDetails from "./component/Product/ProductDetails";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import UserOptions from "./component/layout/Header/UserOptions";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";

import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
// import axios from "axios";
// import Payment from "./component/Cart/Payment";
// import {Elements} from "@stripe/react-stripe-js";
// import {loadStripe} from "@stripe/stripe-js";
// import OrderSuccess from "./component/Cart/OrderSuccess";
// import MyOrders from "./component/Cart/MyOrders"; 
// import OrderDetails from "./component/Order/OrderDetails";

// Admin components calling.
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct.js";

import {useSelector} from "react-redux";
import {loadUser} from "./actions/userAction";

// import Loader from "./component/layout/Loader/Loader";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import { useEffect} from "react";
import store from "./store";


const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey(){
  //     const {data} = await axios.get("/api/v1/stripeapikey");
  //     setStripeApiKey(data.stripeApiKey);
  // }
  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    // getStripeApiKey();
  }, []);


  // {stripeApiKey && (
  //   <Elements stripe={loadStripe(stripeApiKey)}>
  //     <ProtectedRoute exact path="/process/payment" component={Payment} />
  //   </Elements>
  // )}

  // <ProtectedRoute exact path="/success" component={OrderSuccess} />
  //  <ProtectedRoute exact path="/orders" component={MyOrders} />
  // <ProtectedRoute exact path="/orders" component={MyOrders} />
  // <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
  
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Switch>
        {" "}
        <Route exact path="/" component={Home} />{" "}
        <Route exact path="/product/:id" component={ProductDetails} />{" "}
        <Route exact path="/products" component={Products} />{" "}
        <Route path="/products/:keyword" component={Products} />{" "}
        <Route exact path="/search" component={Search} />{" "}
        <Route exact path="/login" component={LoginSignUp} />
        <ProtectedRoute exact path="/account" component={Profile}/>
        <ProtectedRoute exact path="/me/update" component={UpdateProfile}/>
        <ProtectedRoute exact path = "/password/update" component={UpdatePassword} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword}/>
        <Route exact path="/cart" component={Cart}/>
        <ProtectedRoute exact path="/shipping" component={Shipping}/>
        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
       
        <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard}/>
        <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ProductList} />
        <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        />
        <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct} />
  
        </Switch>
      <Footer />
    </Router>
  );
};

export default App;
