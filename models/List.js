

// Schema created but not in use because i found that i can build functionality without even also creating a new model for lists

const mongoose = require("mongoose");


const listSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    data:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"note"
        }
    ],
    owner:{
        type:String, //user._id store kva dege nhi uski bhi jaraurt nhi hai
    }
});

const List = new mongoose.model("list",listSchema);

module.exports = {List};