import React, {Fragment, useState, useEffect} from 'react';
import "./NewProduct.css";
import {useDispatch, useSelector} from "react-redux";
import {clearErrors, createProduct} from "../../actions/productAction";
import {useAlert} from "react-alert";
import {Button} from "@material-ui/core";
import MetaData from "../layout/MetaData";
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";


const NewProduct = ({history}) => {
  
  const dispatch = useDispatch();
  const alert = useAlert();

  const {loading, error, success} = useSelector((state)=>state.newProduct);

  const [name, setName]=useState("");
  const [price, setPrice]=useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock]=useState(0);
  const [images, setImages]=useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const categories = [
    "Laptop", "Mobile", "TV",
    "FootWear", "TopWears", "Botto,Wears",
    "Camers", "accessories",
  ];

  const createProductSubmitHandler = (e)=>{
    e.preventDefault();

  }


  useEffect(()=>{
      if(error){
        alert.error(error)
        dispatch(clearErrors());
      }

      if(success){
        alert.success("Product Created Successfully.");
        history.push("/admin/dashboard");
        dispatch({type:NEW_PRODUCT_RESET});
      }
  },[dispatch, error, alert, success, history]);

  
  return (
    <Fragment>
      <MetaData title="Create Product"/>
      <div className="dashboard">
        <SideBar/>
        <div className="newProductContainer">
          <form onSubmit={createProductSubmitHandler} className="createProductForm" encType="multipart/form-data">
            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon/>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
