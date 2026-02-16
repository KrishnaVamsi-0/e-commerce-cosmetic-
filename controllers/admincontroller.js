const Admin=require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Adminregister=async(req,res)=>{
  try{
    const { name, email, password } = req.body;
    const adminrecord=await Admin.findOne({email})
    if(adminrecord){
      return res.status(400).json({msg:"email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin=await Admin.create({
      name,
      email,
      password: hashedPassword,
    })
    return res.status(201).json({msg:"admin registered"})

  }catch(error){
    res.status(500).json({msg:error.message})

  }
}
module.exports ={Adminregister};