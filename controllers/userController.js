const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const fs = require('fs')


const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"})
};

const writeData=(userData)=>{

    fs.readFile('./data/users.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.push(userData); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('./data/users.json', json, 'utf8',function(err){
            if (err) throw err;
            console.log('complete');
        }); 
    }});

}


const readData=()=>{
    let userData=JSON.parse(fs.readFileSync('./data/users.json','utf-8'))

    return userData
}

const userExists=(username)=>{
    const userData=readData()

    for(let i=0;i<userData.length;i++)
    {
        if(userData[i].username===username)
        {
            return true
        }
    }

    return false
}


// Register User
const registerUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;

    // validation for email,name,password

    if(!username || !password)
    {
        res.status(400)
        throw new Error("Please fill in all required fields! ")
    }

    if(userExists(username))
    {
        res.status(400)
        throw new Error('User already exists! ')
    }

    // if password is modified execute this code
    const salt=await bcrypt.genSalt(10);

    const hashedPassword=await bcrypt.hash(password,salt);

    const user=({username,password:hashedPassword})


    writeData(user)

    res.status(201).json({'message':'Customer successfully registered. Now you can login !'})    
});

// Login User
const loginUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;

    // validate request 
    if(!username || !password)
    {
        res.status(400)
        throw new Error("Please add username and password! ")
    }
    
    const users=readData()

    //check if user exists

    
    const user=users.filter((item)=>item.username===username)

    if(!user || user.length===0)
    {
        res.status(400)
        throw new Error("User not found! Please Signup. ")   
    }

    // check if password is correct
    const passwordIsCorrect=await bcrypt.compare(password,user[0].password);

    if(user && passwordIsCorrect)
    {

        // generate jwt token
        const token=generateToken(username);

        res.status(200).json({'message':'Customer successfully logged in!','data':{token}});
    }
    else
    {
        res.status(400)
        throw new Error("Invalid email or password!")   
    }
});






module.exports={registerUser,loginUser}