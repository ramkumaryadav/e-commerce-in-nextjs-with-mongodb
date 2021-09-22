import jwt from 'jsonwebtoken';
import Cart from '../../models/Cart';
import Authenticated from '../../helper/Authenticated';
import DB from '../../helper/DB'

DB()

export default async (req,res)=>{
    switch(req.method){
        case "GET":
            await fetchUserCart(req,res)
            break
        case "PUT":
            await addProduct(req,res)
            break
        case "DELETE":
            await removeproduct(req,res)
            break
    }
}



const fetchUserCart = Authenticated(async(req,res) =>{
        const cart = await Cart.findOne({user:req.userId})
        // use populate method to get all products form array (you get the list of product details)
          .populate("products.product")  
        res.status(200).json(cart.products)
})

const addProduct = Authenticated(async(req,res) =>{
    const {quantity,productId} = req.body
    const cart = await Cart.findOne({user:req.userId})
    // some use for - if any product are seletd in our cart then we add vlue not product
    const pExists = cart.products.some(pdoc => productId === pdoc.product.toString())
    if(pExists){
          await Cart.findOneAndUpdate(
              {_id:cart._id,"products.product":productId}, 
          {$inc:{"products.$.quantity":quantity}}
          )
    }else{
        const newProduct = {quantity,product:productId}
        // find id are exists or not in cart
        await Cart.findOneAndUpdate(
            {_id:cart._id}, {$push:{products:newProduct}})
    }
    res.status(200).json({message:"product added to cart"})

})
// delete process here 
const removeproduct = Authenticated(async(req,res) =>{
    const {productId} = req.body
   const cart = await Cart.findOneAndUpdate(
         {user:req.userId},
         // pull request form product array
         {$pull:{products:{product:productId}}},
         {new:true}
    ).populate("products.product")
    //return request to cart
    res.status(200).json(cart.products)
})