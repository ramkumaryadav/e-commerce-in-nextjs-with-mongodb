// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import DB from '../../helper/DB';
import Product from '../../models/Product';

DB();

export default async (req,res)=>{
  switch(req.method)
  {
     case "GET":
       await getallProducts(req,res)
       break
     case "POST":
      await saveProduct(req,res)
       break
  }
}

const getallProducts = async (req,res)=>{
 // find empty mens we need all product which is avilabe from our database
 try{
  const products = await Product.find()
    res.status(200).json(products)
 }catch(err){
   console.log(err)
 }
 
}

const saveProduct = async (req,res)=> {
  // we get request in body and destructre the request
const {name,price,discription,mediaUrl} = req.body
//console.log(name,price,discription,mediaUrl)
try{
  if(!name || !price || !discription || !mediaUrl){
    return res.status(244).json({error:"Please add all the fileds"})
   }
   const product = await new Product({
     name,
     price,
     discription,
     mediaUrl
   }).save()
   res.status(201).json(product)
}catch(err){
res.status(500).json({error:"internal server error"})
console.log(err)
}
}


