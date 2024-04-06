

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type: String,
    },
    created_at:{
        type:Date,
        default: Date.now(),
    },
    list:[
        {
            type:String,
        }
    ],
    created_by:{
        type:String,
    },

   
});



const Note = new mongoose.model("note",noteSchema);

module.exports = {Note};