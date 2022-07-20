const routes = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");

routes.get("/", (req, res) => {
	return res.send("testing")
})

//update
routes.put("/:id", async(req, res) => {
	if(req.body.userId === req.params.id || req.body.idAdmin){
		if(req.body.password){
			try{
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);

			}catch(err){
				res.status(500).json(err)
			}
		}
		try{
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body
			});

			res.status(200).json({message: "user updated successfully"});
		}catch(err){
			res.status(500).json(err);
		}
	}else{
		res.status(403).json({error: "Forbidden"});
	}
});
//delete

routes.delete("/:id", async(req, res) => {
	if(req.body.userId === req.params.id || req.body.idAdmin){
		try{
			const user = await User.findByIdAndDelete(req.params.id);

			res.status(200).json({message: "account deleted successfully"});
		}catch(err){
			res.status(500).json(err);
		}
	}else{
		res.status(403).json({error: "Forbidden"});
	}
});
//get

routes.get("/:id", async (req, res) => {
	try{
		const user = await User.findById(req.params.id);
		const {password, updatedAt, isAdmin, ...other} = user._doc;
		res.status(200).json(other);
	}catch(err){
		res.status(500).json(err);
	}
});
//follow

routes.put("/:id/follow", async (req, res) => {
	if(req.body.userId !== req.params.id){
		try{
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if(!user.followers.includes(req.body.userId)){
				await user.updateOne( { $push: {followers: req.body.userId} } );
				await currentUser.updateOne( { $push: {following: req.params.id} } );

				res.status(200).json({message: "user has been followed"})
			}else{
				res.status(403).json({error: "you already follow this user"})
			}
		}catch(err){
			res.status(500).json(err);
		}
	}else{
		res.status(403).json({error: "you can't follow yourself"});
	}
});
//unfollow

routes.put("/:id/unfollow", async (req, res) => {
	if(req.body.userId !== req.params.id){
		try{
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if(user.followers.includes(req.body.userId)){
				await user.updateOne( { $pull: {followers: req.body.userId} } );
				await currentUser.updateOne( { $pull: {following: req.params.id} } );

				res.status(200).json({message: "user has been unfollowed"})
			}else{
				res.status(403).json({error: "you don't follow this user"})
			}
		}catch(err){
			res.status(500).json(err);
		}
	}else{
		res.status(403).json({error: "you can't unfollow yourself"});
	}
});

module.exports = routes;