



const express = require("express");
const router = express.Router({ mergeParams: true });
const { Note } = require("../models/Note");
const { User } = require("../models/User");
const wrapAsync = require("../middlewares/wrapAsync");
const { parse } = require("dotenv");
const { isOwner } = require("../middlewares/isOwner")



router.get("/profile/:id", async (req, res) => {
    let allNote, completedNote, uncompletedNote, upcomingNote;
    if (req.user.notes && req.user.notes.length) {
        allNote = await Note.find({ created_by: `${req.user._id}` });
    }
    res.render("./user/profile.ejs", { allNote });
});


router.get("/profile/:id/edit", async (req, res) => {
    res.render("./user/editProfile.ejs");
});
router.put("/profile/:id/edit", isOwner, async (req, res) => {
    let { user } = req.body;
    delete user.username; //it someone added i will not allow to change anybody
    // user.name = user.name.toLowerCase(); //user have full choice to  decide name
    let phone_no = user.contact_num;
    
    // console.log(phone_no)
    // if (phone_no.length < 10 || phone_no.length > 13) { //e.g. +91 81681-52757
    //     phone_no = null;
    //     req.flash("error","Please Enter Vaild Phone Number :)");
    //     res.redirect(`/user/profile/${req.user._id}/edit`);
    // } else {
    //     if (phone_no.length == 10) {
    //         phone_no = "91" + phone_no;
    //     }

        // user.contact_num = phone_no;
        let updatedUser = await User.findByIdAndUpdate(`${req.user._id}`, { ...user }, { new: true, runValidators: true });
        console.log(updatedUser);
        // let updatedUser = await User.findById(`${req.user._id}`);
        res.redirect(`/user/profile/${req.user._id}`);
    // }
});




// router.get("/:id/delete/account",isOwner, async (req, res) => {
//     let { id } = req.params;
//     let delUser = await User.findByIdAndDelete(id);
//     console.log(delUser);
//     res.redirect("/");
// });

module.exports = router;