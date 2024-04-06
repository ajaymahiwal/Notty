



const express = require("express");
const router = express.Router({ mergeParams: true });
const { Note } = require("../models/Note");
const { User } = require("../models/User");
const wrapAsync = require("../middlewares/wrapAsync");
const passport = require('passport');


router.get("/", (req, res) => {
    res.render("./main/home.ejs");
});



router.get("/dashboard", (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}, (req, res) => {
    res.render("./main/dashboard");
});

router.get("/privacy-policy", (req, res) => {
    res.render("./other/privacy.ejs");
});
router.get("/terms", (req, res) => {
    res.render("./other/terms.ejs");
});
router.get("/about-us", (req, res) => {
    res.render("./other/about-us.ejs");
});


router.get("/signup", (req, res) => {
    res.render("./user/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
    try {
        let { name, username, password } = req.body.user;
        let email = username;
        name = name.toLowerCase();
        const user = new User({ name, username, email });
        let checkUser = await User.findOne({ username });
        if (!checkUser) {
            const regUser = await User.register(user, password);

            req.login(regUser, (err) => {
                if (err) {
                    res.redirect("/signup");
                }
                else{
                    console.log("Successful new account is created. and login done");
                    if(req.user.contact_num){
                        res.redirect(`/user/profile/${req.user._id}`);
                    }else{
                        res.redirect(`/user/profile/${req.user._id}/edit`);
                    }
                }
            })
        }
        else {
            req.flash("error", "Username already exits, So Direct Login.");
            res.redirect("/login");
        }

    }
    catch (err) {
        console.log("ERROR on signup post route.");
        console.log(err);
        next(err);
    }
});

router.get("/login", (req, res) => {
    res.render("./user/login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, successFlash: true }), (req, res) => {
    console.log("login complete");
    // req.flash("success", "Wow,You are logged in !");
    if(req.user.contact_num){
        res.redirect(`/user/profile/${req.user._id}`);
    }else{
        res.redirect(`/user/profile/${req.user._id}/edit`);
    }
});

router.delete("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You Are Logged Out!");
        res.redirect("/");
    });
});


// Google Auth
router.get("/login/google",
            passport.authenticate('google',{scope:['profile','email']})
);
router.get("/auth/google/callback",
            passport.authenticate('google',{ failureRedirect:"/signup",failureFlash:true}),
            (req,res)=>{
                if(req.user.contact_num){
                    res.redirect(`/user/profile/${req.user._id}`);
                }else{
                    res.redirect(`/user/profile/${req.user._id}/edit`);
                }
            }
);


module.exports = router;