import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
    //beause of git i remove this 
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);
      done(null, profile);
    }
  )
);

// Middleware for Passport
app.use(passport.initialize());

// Google authentication routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Request profile and email
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success", // Redirect on success
    failureRedirect: "/failure", // Redirect on failure
  })
);

// Success and failure routes
app.get("/success", (req, res) => res.send("Login Successful!"));
app.get("/failure", (req, res) => res.send("Login Failed!"));

// Export the app
export const index = app;
