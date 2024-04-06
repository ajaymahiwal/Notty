

const mongoose = require("mongoose");


const newletterSchema = new mongoose.Schema({
    email:{
        type:String,
    },
});

const Newsletter = new mongoose.model("newsletteremail",newletterSchema);

module.exports = {Newsletter};