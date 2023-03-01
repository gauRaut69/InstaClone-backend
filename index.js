const express=require("express");
const multer=require("multer");
const mongoose=require("mongoose");
const cors=require('cors');
const app=express();
app.use(cors());
const port = process.env.PORT || 8080;
app.use(express.json());

app.use("/uploads",express.static("./uploads"));

// connecting to database
mongoose.connect("mongodb+srv://graut96:nbssmlrs@newcluster.m7t3a2i.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})

//schema 
const postSchema= new mongoose.Schema({
    PostImage:{type:String},
    name:{type:String },
    location:{type:String},
    description:{type:String}
})

// model
const PostUser=new mongoose.model("PostUser", postSchema); // collectionName & Schema

//storage
const Storage=multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
//upload
const upload=multer({
    storage:Storage
})


//api 
app.post("/post-page" ,upload.single('PostImage'), async(req, res) => {
	try {
		
			console.log(req.file)
			const data={
                PostImage:  req.file.filename,
				name: req.body.name,
				location: req.body.location,
				description: req.body.description
			}
			const users = await PostUser.create(data);
			res.json({
					status: "Success",
					users
			})

	}catch(e) {
			res.status(500).json({
					status: "failed",
					message: e.message
			})
	}

})
//api
app.get("/post-page",async (req,res)=>{
    try{
        const User= await PostUser.find();
     res.json({
        status:"success",
        user:User
         })
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
})

// listner
app.listen(port,()=>{
    console.log("server is running at port "+port);
})
