const routes = require("express").Router();
const Post = require("../Models/Post");

//create

routes.post("/", async(req, res) => {
	const newPost = new Post(req.body);
	try{
		const savedPost = await newPost.save();
		res.status(200).json(savedPost);
	}catch(err){
		res.status(500).json(err)
	}
});

//update

routes.put("/:id", async (req, res) => {
	try{
		const post = await Post.findById(req.params.id);
		if(post.userId === req.body.userId){
			await post.updateOne({$set:req.body});
			res.status(200).json({message: "the post has been updated"});
		}else{
			res.status(403).json({error: "you can edit only your own post"});
		}
	}catch(err){
		res.status(500).json(err);
	}
});

//delete

routes.delete("/:id", async (req, res) => {
	try{
		const post = await Post.findById(req.params.id);
		if(post.userId === req.body.userId){
			await post.deleteOne({$set:req.body});
			res.status(200).json({message: "the post has been delete"});
		}else{
			res.status(403).json({error: "you can delete only your own post"});
		}
	}catch(err){
		res.status(500).json(err);
	}
});

//like

routes.put("/:id/like", async (req, res) => {
	try{
		const post = await Post.findById(req.params.id);

		if(!post.likes.includes(req.body.userId)){
			await post.updateOne( { $push: { likes:req.body.userId } } );

			res.status(200).json({message:"the post has been liked"});
		} else{
			await post.updateOne( { $pull: { likes:req.body.userId } } );
			res.status(200).json({message: "the post has been disliked"});
		}
	}catch(err){
		res.status(500).json(err);
	}
});

//get

routes.get("/:id", async(req, res) => {
	try{
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	}catch(err){
		res.status(500).json(err);
	}
})

//get timeline 

routes.get("/timeline", async(req, res) => {
	let postArray = [];
	try{
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({userId: currentUser._id});
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({userId: friendId});
			})
		);

		res.status(200).json(userPosts.concat(... friendPosts));

	}catch(err){
		res.status(500).json(err);
	}
});

module.exports = routes;