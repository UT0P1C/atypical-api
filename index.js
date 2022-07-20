const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//connect with database
mongoose.connect(
	process.env.URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
)
.then(()=>console.log('database connected'))
.catch(e=>console.log(e));

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.use("/api/posts", postRoute);

//connect express
app.listen(1337, () => {
	console.log("Server is runnig on port 1337");
})