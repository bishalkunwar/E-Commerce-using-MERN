import axios from "axios";
import { CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL, CLEAR_ERRORS, 
    MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS, MY_ORDERS_FAIL, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCES,} from "../constants/orderConstants";


    //create order
export const createOrder = (order)=>async(dispatch)=>{
    try {
        dispatch({type:CREATE_ORDER_REQUEST});
        
        const config = {headers:{"Content-Type":"application/json",},};

        const {data}= await axios.post("/api/v1/order/new", order, config);

        dispatch({type:CREATE_ORDER_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type:CREATE_ORDER_FAIL, payload:error.response.data.message,});
    }

};


//my orders
export const myOrders = ()=>async(dispatch)=>{
    try{
        dispatch({type:MY_ORDERS_REQUEST});

        const {data} = await axios.get("/api/v1/orders/me");
        dispatch({type:MY_ORDERS_SUCCESS, payload:data.orders});
    }catch(error){
        dispatch({
            type:MY_ORDERS_FAIL, payload:error.response.data.message,
        })
    }
};


// get order details.
export const orderDetails = (id)=>async(dispatch)=>{
    try {
        dispatch({type:ORDER_DETAILS_REQUEST});
 
        const {data} = await axios.get(`/api/v1/order/${id}`);

        dispatch({type:ORDER_DETAILS_SUCCES, payload:data.order})
    } catch (error) {
        dispatch({type:ORDER_DETAILS_FAIL, payload:error.response.data.message,})
    }
};


export const clearErrors = ()=>async(dispatch)=>{
    dispatch({type:CLEAR_ERRORS});
}

