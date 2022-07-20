const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 5,
		max:15,
		unique: true
	},
	email: {
		type: String,
		required: true,
		max: 50,
		unique: true
	},
	password: {
		type: String,
		required: true,
		min: 6
	},
	profilePicture: {
		type: String,
		default: ""
	},
	coverPicture: {
		type: String,
		default: ""
	},
	followers: {
		type: Array,
		default: []
	},
	following: {
		type: Array,
		default: []
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	description: {
		type: String,
		max: 60
	},
	city: {
		type: String,
		max: 60
	},
	from: {
		type: String,
		max: 60
	},
	relationship: {
		type: Number,
		enum: [1, 2, 3]
	},

}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);