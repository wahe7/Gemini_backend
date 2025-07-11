const prisma = require("../config/db");

exports.getUser = async (req, res) => {
    const user = await prisma.user.findUnique({where:{id: req.user.id}})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json(user)
}
