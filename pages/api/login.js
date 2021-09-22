import DB from '../../helper/DB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

DB()

export default async (req,res) => {
    const {email,password} = req.body
    try{
        if(!email || !password){
            return  res.status(422).json({error:"Please fill all the fields"})
          }
          const user = await User.findOne({email})
          if(!user) {
           return  res.status(404).json({error:"User Not found with this email ID"})
          }
      
         const doMatch = await bcrypt.compare(password,user.password)
         if(doMatch){
          const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"10d"})
          // tokan given
          const {name,role,email} = user
          res.status(201).json({token,user:{name,role,email}})
         }else{
          return res.status(401).json({error:"email and password do not match!!"})
         }
      
    }catch(err){
        console.log(err)
    }
}