const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const bcrypt = require("bcrypt");

const OTP_EXPIRY = 5 * 60 * 1000;
const OTP_STORE = {};

exports.signUp = async (req, res) => {
    const {phone_number, name, password} = req.body;
    if(!phone_number || !name || !password){
      return res.status(400).json({message:"Phone number, name and password are required"})
    }

    const existingUser = await prisma.user.findUnique({where:{phone_number}})
    if(existingUser){
      return res.status(400).json({message:"User already exists"})
    }

    const user = await prisma.user.create({
      data: {
        phone_number,
        name,
        password,
      }
    })

    return res.status(200).json({message:"User created successfully"})
}

exports.sendOtp = async (req, res) => {
    const {phone_number} = req.body;
    if(!phone_number){
      return res.status(400).json({message:"Phone number is required"})
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    OTP_STORE[phone_number] = {otp, expiresAt: Date.now() + OTP_EXPIRY};
    console.log(OTP_STORE);

    return res.status(200).json({message:"Otp sent successfully", otp})
    
};

exports.verifyOtp = async (req, res) => {
    const {phone_number, otp} = req.body;
    if(!phone_number || !otp){
      return res.status(400).json({message:"Phone number and otp are required"})
    }
    
    const storedOtp = OTP_STORE[phone_number];
    if(!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()){
      return res.status(400).json({message:"Invalid otp or expired otp"})
    }

    const user = await prisma.user.findUnique({where:{phone_number}})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return res.status(200).json({message:"Mocked", token})

};

exports.forgotPassword = async (req, res) => {
    const {phone_number} = req.body;
    if(!phone_number){
      return res.status(400).json({message:"Phone number is required"})
    }

    const user = await prisma.user.findUnique({where:{phone_number}})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    OTP_STORE[phone_number] = {otp, expiresAt: Date.now() + OTP_EXPIRY};
    
    return res.status(200).json({message:"Mocked", otp})
}

exports.changePassword = async (req, res) => {
    const {password} = req.body;
    if(!password){
      return res.status(400).json({message:"Password is required"})
    }
    const user = await prisma.user.findUnique({where:{id: req.user.id}})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update(
      {where:{id: req.user.id},
       data:{password: hashedPassword}
      })
    return res.status(200).json({message:"Password changed successfully"});
}

