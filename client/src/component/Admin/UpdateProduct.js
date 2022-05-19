import React, {Fragment, useEffect, useState} from 'react';
import "./UpdateProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, updateProduct, getProductDetails } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellCheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';





const UpdateProduct = ({history, match}) => {

  const dispatch=useDispatch();
  const alert = useAlert();

  const {error, product} = useSelector((state)=>state.productDetails);

  const {loading, error:updateError, isUpdated,} = useSelector((state)=>state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock]=useState(0);
  const [images, setImages]=useState([]);
  const[oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview]=useState([]);
  
  
  const categories = [
    "Laptop", "Mobile", "TV",
    "FootWear", "TopWears", "Botto,Wears",
    "Camers", "accessories",
  ];
  

  const productId=match.params.id;

  useEffect(()=>{
    if(product && product._id!==productId){
      dispatch(getProductDetails(productId));
    }else{
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.Stock);
      setOldImages(product.images);
    }

    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }

    if(updateError){
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if(isUpdated){
      alert.success("Product Updated Successfully");
      history.push("/admin/product");
      dispatch({type:UPDATE_PRODUCT_RESET});
    }
  }, [dispatch, alert, error, isUpdated, history, productId, product, updateError,]);


  const updateProductSubmitHandler=(e)=>{
      e.preventDefault();

      const myForm = new FormData();

      myForm.set("name", name);
      myForm.set("price", price);
      myForm.set("description", description);
      myForm.set("category", category);
      myForm.set("Stock", Stock);
      
      images.forEach((image)=>{
        myForm.append("images", image);
      });
      
      dispatch(updateProduct(productId, myForm));
  };


  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };


  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar/>
        <div className="newProductContainer">
          <form onSubmit={updateProductSubmitHandler} className="createProductForm" encType="multipart/form-data">
            <h1>Update Product</h1>

              <div>
                <SpellCheckIcon/>
                <input type="text" placeholder="Product Name" required value={name} onChange={(e)=>setName(e.target.value)} />
              </div>

              <div>
                <AttachMoneyIcon/>
                <input type="number" placeholder="Price" required value={price} onChange={(e)=>setPrice(e.target.value)} />
              </div>
              
              <div>
                <DescriptionIcon/>
                <textarea name="Product Description" value={description} cols="30" rows="1" onChange={(e)=>setDescription(e.target.value)}></textarea>
              </div>

              <div>
                <AccountTreeIcon/>
                <select name="category" value={category} onChange={(e)=>setCategory(e.target.value)} >
                  <option value="">Choose Category</option>
                    {categories.map((cate)=>(
                      <option key={cate} value={cate}>{cate}</option>
                    ))}
                </select>
              </div>

              <div>
                <StorageIcon/>
                <input type="number" placeholder="Stock" required value={Stock} onChange={(e)=>setStock(e.target.value)} />
              </div>

              <div id="createProductFormFile">
                <input type="file" name="avatar" accept="image/*" multiple onChange={updateProductImagesChange} />
              </div>

              <div id="createProductFormImage">
                {oldImages&&oldImages.map((image, index)=>(
                  <img src={image.url} alt="Old Product Preview" key={index} />
                ))}
              </div>

              <div id="createProductFormImage">
                {imagesPreview.map((image, index)=>(
                  <img key={index} src={image} alt="Product Preview"/>
                )
                
                )}
              </div>

              <Button id="updateProductBtn" type="submit" disabled={loading?true:false}>Update</Button>


          </form>

        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;