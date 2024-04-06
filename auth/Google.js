
const { User } = require("../models/User");


module.exports = {
    credentials:{
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECTION_URI,
    },
    callbackFunx:async function(accessToken,refreshToken,profile,done){
            console.log(profile);
            try{
                let user = await User.findOne({username:profile.emails[0].value});
    
                if(!user){
                    user = new User({
                        email: profile.emails[0].value,
                        google_id: profile.id,
                        username: profile.emails[0].value,
                        name: profile.displayName,
                        image:profile.photos[0].value,
                    });
    
                    await user.save();
                }
    
             // Pass the user object to the done callback to indicate successful authentication
             return done(null, user);
            } catch (err) {
              // Pass the error to the done callback to indicate authentication failure
              return done(err, null);
            }
        }
}