const users = require("../models/userModel")
const jwt = require("jsonwebtoken")

// register
exports.registerController =async (req,res)=>{
    // logic
    const {username,email,password} = req.body
    console.log(username,email,password);
    
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(400).json("Already registered user....")
        }else{
            const newUser = new users({
                username,email,password,profile:""
            })
            await newUser.save() // saved to mongoDB
            res.status(200).json(newUser)
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

// login
exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(401).json("User Does not exist....");
        }

        if (existingUser.password !== password) {
            return res.status(401).json("Password Does not match....");
        }

        const token = jwt.sign(
            { userMail: existingUser.email },
            process.env.secretKey
        );

        return res.status(200).json({ existingUser, token });

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};



// Google login
exports.googleLoginController =async (req,res)=>{
    
    const {username,email,password,photo} = req.body
    console.log(username,email,password,photo);
    
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){          
                const token = jwt.sign({userMail:existingUser.email},"secretKey")
                res.status(200).json({existingUser,token})
        }else{
            const newUser = new users({
                username,email,password,profile:photo
            })
            await newUser.save() // saved to mongoDB
            const token = jwt.sign({userMail:existingUser.email},"secretKey")
            res.status(200).json({existingUser:newUser,token})
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

//................Admin............
//get all users
exports.getAlluserController = async (req, res) => {
  console.log("inside getAll UserController");
  const payload = req.payload;            
  const email = payload.userMail;       

  try {
    const allUsers = await users.find({ email: { $ne: email } });
    return res.status(200).json({ allUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// edit admin profile
exports.editAdminProfileController = async (req, res) => {
  console.log("inside editAdminProfileController");

  const { username, password } = req.body;
  const profile = req.file ? req.file.filename : null;

  const email = req.payload.userMail;

  try {
    const adminDetails = await users.findOneAndUpdate(
      { email },
      {
        username,
        password,
        ...(profile && { profile })
      },
      { new: true }
    );

    res.status(200).json(adminDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// edit user profile
exports.editUserProfileController = async (req, res) => {
  console.log("inside editUserProfileController");

  const { username, password,profile,bio } = req.body;
  const prof = req.file ? req.file.filename : profile;

  const email = req.payload.userMail;

  try {
    const userDetails = await users.findOneAndUpdate(
      { email },
      {
        username,
        password,
        profile:prof,
        bio
      },
      { new: true }
    );

    res.status(200).json(userDetails);
  } catch (err) {
   // console.log(err);
    res.status(500).json(err);
  }
};