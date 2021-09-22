import baseUrl from '../helper/baseUrl';
import { parseCookies } from 'nookies';
import cookies from 'js-cookie';
import {useRouter} from 'next/router';
import Link from 'next/link'
import { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';


const Cart = ({error,products}) => {
    const {token} = parseCookies()
    const router = useRouter()
    const [cProducts,setCartProduct] = useState(products)
    let price = 0
    if(!token){
        return(
            <div className="center-align">
             <h4>Please login to view your cart</h4>
             <Link href="/login"><a><button className="btn #ef6c00 orange darken-3">Login</button></a></Link>
            </div>
        )
    }
     if(error){
      //  M.toast({html: res2.error, classes:"red"})
         M.toast({html:error,classes:"red"})
         cookies.remove("user")
         cookies.remove("token")
         router.push('/login')
     }

     // remove product from cart
     const handleRemove = async (pid)=>{
     const res = await fetch(`${baseUrl}/api/cart`,{
           method:"DELETE",
           headers:{
               "Content-Type":"application/json",
               "Authorization":token
           },
           body:JSON.stringify({
               productId:pid
           })
       })
      const res2 = await res.json()
      setCartProduct(res2)
     }

     // make a compnent for get item - its a funcanal compnents
    const CartItem = () =>{
          return(
              <>
                {cProducts.map(item=>{
                  price = price + item.quantity * item.product.price
                    return(
                        <div style={{display:"flex",margin:"20px"}} key={item._id}>
                            <img src={item.product.mediaUrl} style={{width:"10%"}} />
                            <div style={{marginLeft:"20px"}}>
                                <h6>{item.product.name}</h6>
                                <h6> {item.quantity} X ₹ {item.product.price}</h6>
                                <button className="btn red" onClick={()=>{handleRemove(item.product._id)}}>Remove</button>
                            </div>
                        </div>
                    )
                })} 
              </>
          )
    }

    const handleCheckout = async (paymentInfo)=>{
        console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`,{
            method:"POST",
            headers:{
               "Content-Type":"application/json",
              "Authorization":token 
            },
            body:JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json()
        M.toast({html: res2.message, classes:"green"})
        router.push('/')
    }

    // make a components for total price
    const TotalPrice = ()=>{
        return(
            <div className="container" style={{display:"flex",justifyContent:"space-between"}}>
            <h5>total ₹ {price}</h5>
            {products.length != 0
            &&  <StripeCheckout
            name="e-commerce"
            amount={price * 100}
            image={products.length > 0 ? products[0].product.mediaUrl:""}
            currency="INR"
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            stripeKey="pk_test_51JaIuiSCHdv10c940DTHRyBTUlTNjqAEok5GQMz6F5TBqNREaJZpSaf0vzoQ7u0gytq8J57ODcPklwSaVnDs6ToP00bmwzJQ5y"
            token={(paymentInfo)=>handleCheckout(paymentInfo)}
            >
            <button className="btn">Checkout</button>
            </StripeCheckout>
            }
          
        </div>
        )
    }  

    return (
        <>
        <div className="container" >
        <CartItem />
        <TotalPrice />
        </div>
        </>
    )
}
// npm install react-stripe-checkout stripe uuid for payment method

// product is user spacfic then we use getServerSideProps
export async function getServerSideProps(ctx){
    const {token} = parseCookies(ctx)
    if(!token){
        return{
            props:{products:[]}
        }
    }
    const res = await fetch(`${baseUrl}/api/cart`, {
      headers:{
        "Content-Type":"application/json",
               "Authorization":token
      }
    })
    const products = await res.json()
    if(products.error){
        return{
            props:{error:products.error}
        }
    }
    console.log("products", products)
    return{
        props:{products}
    }
    
}

export default Cart;
