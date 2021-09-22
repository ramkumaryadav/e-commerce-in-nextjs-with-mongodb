import DB from '../../helper/DB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import Cart from '../../models/Cart'

DB()

export default async (req,res) => {
    const {name,email,password} = req.body
    try{
        if(!name || !email || !password){
            return  res.status(422).json({error:"Please fill all the fields"})
          }
          const user = await User.findOne({email})
          if(user) {
           return  res.status(422).json({error:"Email alrady exists"})
          }
        const hashedPassword = await bcrypt.hash(password, 14)
       const newUser = await new User({
            name,
            email,
            password:hashedPassword
        }).save()
      await new Cart({user:newUser._id}).save()
        // console.log(newUser)
        res.status(201).json({message:"signup successfully"})
    }catch(err){
        console.log(err)
    }
}