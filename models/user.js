const  mongoose =require("mongoose")
var userSchema = mongoose.Schema({
     email:{
        type:String,
        required:"Email is required",
        unique:true
    } ,
    password:{
        type:String,
        required:"password is required"
    } ,
    role:{
        type:Number,
        default:0
    } ,
    firstname: {
        type: String,
        required: false,
    },

    lastname: {
        type: String,
        required: false,
    },
});

module.exports=mongoose.model('User',userSchema)
