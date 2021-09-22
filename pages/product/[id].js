import baseUrl from "../../helper/baseUrl";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import cookie2 from 'js-cookie';
import {parseCookies} from 'nookies'



const Product = ({product}) => {
  const [quantity,setQuantity] = useState(1)
  // for delete modalref and useEffect
const modalref = useRef(null)
const cookie = parseCookies();
const user =  cookie.user ? JSON.parse(cookie.user) : "" //JSON.parse
useEffect(()=>{
M.Modal.init(modalref.current)
},[])
// delete popup modal here
const getModal = ()=>{
return(
<div id="modal1" className="modal" ref={modalref}>
    <div className="modal-content">
      <h4>{product.name}</h4>
      <p>Are you sure? You want to delete !!</p>
    </div>
    <div className="modal-footer">
    <button data-target="modal1" className="btn modal-trigger #01579b light-blue darken-4" >Cancle
        </button>
        <button data-target="modal1" className="btn modal-trigger #d84315 deep-orange darken-3" onClick={()=>deleteProduct()}>Yes
        </button>
    </div>
  </div>
)
}

    const router = useRouter();
    const deleteProduct = async () =>{
     const res = await fetch(`${baseUrl}/api/product/${product._id}`,{method:"DELETE"})
     await res.json()
     router.push('/')
    }
    
    const AddToCart = async ()=>{
     const res = await fetch(`${baseUrl}/api/cart`, {
        method:"PUT",
        headers:{
          'Content-Type': 'application/json',
          "Authorization":cookieuser.token
        },
          body:JSON.stringify({
          quantity,
          productId:product._id
          })
      })
       const res2 = await res.json()
       //console.log(res2)
       if(res2.error){
        M.toast({html:error,classes:"red"})
        cookie2.remove("user")
        cookie2.remove("token")
        router.push('/login')
       }
       M.toast({html:res2.message,classes:"green"})
    }

    return (
        <>
         <div className="card" style={{width:"30%", margin:"20px" }}>
         <nav>
    <div className="nav-wrapper #01579b light-blue darken-4">
      <div className="col s12">
        <Link className="breadcrumb" href="/"><a >Home - </a></Link>
        <span className="white-text text-darken-4">  {product.name}</span>
      </div>
    </div>
  </nav>
         
    <div className="card-image waves-effect waves-block waves-light">
      <img className="activator" src={product.mediaUrl} />
    </div>
    <div className="card-content">
      <span className="card-title activator grey-text text-darken-4">{product.name}</span>
     <h6>Rs. {product.price}</h6>
     <input type="number" style={{width:"100px", margin:"10px"}} min="1" placeholder="Qunatity" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} />
     {user ? 
     <button className="btn waves-effect #01579b light-blue darken-4" onClick={()=>AddToCart()}>Add
     <i className="material-icons right">add_circle</i>
     </button>
     :
     <button className="btn waves-effect #01579b light-blue darken-4" onClick={()=>router.push('/login')} >Login to Add
        <i className="material-icons right">add_circle</i>
        </button>
     }
        
        {
           user.role == 'admin' && user.role == 'root' &&
           <button data-target="modal1" className="btn modal-trigger #d84315 deep-orange darken-3" >Delete
           <i className="material-icons right">delete</i>
           </button>
        }
       
    </div>
    <div class="card-content">
          <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
        </div>
  </div>

  {getModal()}
          
        </>
    )
}
//use of getServerSideProps for get data from database
 export async function getServerSideProps({params:{id}}) {
     const res = await fetch(`${baseUrl}/api/product/${id}`)
     const data = await res.json()
     return {
       props: {product:data}
     }
   }

   /* export async function getStaticProps({params:{id}}) {
    const res = await fetch(`${baseUrl}/api/product/${id}`)
    const data = await res.json()
    return {
      props: {product:data}
    }
  } */




  export default Product;