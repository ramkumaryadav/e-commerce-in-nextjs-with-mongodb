import DB from '../../helper/DB';
import Order from '../../models/Order';
import Authenticated from '../../helper/Authenticated'

DB()

export default Authenticated(async (req,res)=>{
const orders = await Order.find({user:req.userId}).populate("products.product")
res.status(200).json(orders) 
} )