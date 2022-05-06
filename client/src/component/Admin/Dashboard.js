import React from 'react';
import "./Dashboard.css";
import Sidebar from "./Sidebar.js";
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Doughnut, Line } from "react-chartjs-2";
import {useSelector, useDispatch} from "react-redux";
import {getAdminProduct} from "../../actions/productAction";
import { useEffect } from 'react';
// import {getAllOrders} from "../../actions/orderAction";
// import {getAllUsers} from "../../actions/userAction";


const Dashboard = () => {

  const dispatch = useDispatch();
  const {products}=useSelector((state)=>state.products);

  let outOfStock = 0;

  products && products.forEach((item)=>{
    if(item.Stock === 0){
      outOfStock+=1;
    }
  });

  useEffect(()=>{
    dispatch(getAdminProduct());
  }, [dispatch]);

  // let totalAmount = 0;
  // orders && orderrs.forEach((item)=>{
  //   totalAmount+=orders.totalPrice;
  // });





  const lineState = {
    labels:["Initial Amount", "Amount Earned"],
    datasets:[
      {label:"TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49"],
        data:[0, 4000],
        },
    ],
  };

  const doughtnutState = {
      labels:["Out of Stock", "InStock"],
      datasets:[
        {
          backgroundColor:["#00A6B4", "#6800B4"],
          hoverBackgroundColor: ["#4B5000", "#35014F"],
          data:[outOfStock, products.length-outOfStock],
        },
      ],
  };

  return (
    <div className="dashboard"><Sidebar/>
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
          <p>Total Amount <br/>NRS.2000</p>
          </div>
        
        <div className="dashboardSummaryBox2">
          <Link to="/admin/products">
            <p>Product</p><p>{products&&products.length}</p>
          </Link>

          <Link to="/admin/orders">
            <p>Orders</p><p>4</p>
          </Link>

          <Link>
          <p>Users</p><p>2</p>
          </Link>
        </div>
      </div>
      <div className="lineChart">
        <Line data={lineState}/>
      </div>

      <div className="doughnutChart">
        <Doughnut data={doughtnutState} />
      </div>
    </div>
    </div>
  );
};
export default Dashboard;





