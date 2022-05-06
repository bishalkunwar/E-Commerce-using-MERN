import React from 'react';
import "./Dashboard.css";
import Sidebar from "./Sidebar.js";
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
// import {Line, Doughtnut} from "react-chartjs-2";
// import {useSelector, useDispatch} from "react-redux";
// import {getAdminProduct} from "../../actions/productAction";
// import {getAllOrders} from "../../actions/orderAction";
// import {getAllUsers} from "../../actions/userAction";


const Dashboard = () => {
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
            <p>Product</p><p>10</p>
          </Link>

          <Link to="/admin/orders">
            <p>Orders</p><p>4</p>
          </Link>

          <Link>
          <p>Users</p><p>2</p>
          </Link>
        </div>
      </div>

    </div>
    </div>
  );
};
export default Dashboard;



// <div className="lineChart">
// <Line data={lineState}/>
// </div>

// <div className="doughtnutChart">
// <Doughtnut data={doughtnutState} />
// </div>