const routes = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");

//SIGN UP ROUTE

routes.post("/register", async (req, res) => {
	
	try{
		//crypt the pass
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		//create new user
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword
		});
		//save user and return
		const user = await newUser.save();
		res.status(200).json(user)
	}catch(err){
		res.status(500).json(err);
	}
});

//login

routes.post("/login", async (req, res) => {
	
	try{

		//check if the email is valid
		const user = await User.findOne({email:req.body.email});
	
		if(!user){
			res.status(404).json({error: "email not found"});
		}

		//check if the password is valid

		const validPassword = await bcrypt.compare(req.body.password, user.password);

		if(!validPassword){
			res.status(400).json({error: "invalid password"});
		}

		//return response

		res.status(200).json(user);

	}catch(err){
		res.status(500).json(err);
	}
});


module.exports = routes;