// app/routes.js
var User       = require('../app/models/user');
var UserLog    = require('../app/models/userlog');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        UserLog.find({'id': req.user._id}, {_id: 0,target: 1, action: 1, timestamp: 1},function(err,actions){
            if(err){
                res.render('profile.ejs', { message: req.flash('profileMessage', 'History and actions not found') }); 
            } else {
                if(actions.length > 0){
                    var loginHistory = actions.filter(function isLoginEntry(action){
                        return action.action.localeCompare('Login') == 0;
                    });
                    var actionHistory = actions.filter(function isLoginEntry(action){
                        return action.action.localeCompare('Login') != 0;
                    });
                    res.render('profile.ejs', {
                        user : req.user, // get the user out of session and pass to template
                        logins : loginHistory,
                        actions : actionHistory
                    }); 
                } else {
                    res.render('profile.ejs', {
                        user : req.user, // get the user out of session and pass to template
                        logins : [],
                        actions : []
                    });
                }
            }
            var userlog = new UserLog();
                  userlog.id = req.user._id;
                  userlog.action = 'Login',
                  userlog.target = 'localhost';
                  userlog.timestamp = Date.now();
                  userlog.save(function(err){
                  if(err) {
                      console.log("Error creating login entry for user- "+req.user._id);
                    } else {
                      console.log("Login entry created");
                    }
                  });
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/logs', function(req, res) {
      console.log("Trying to save user action");
      var userlog = new UserLog();
      userlog.id = req.user._id;
      userlog.action = req.body.action;
      userlog.target = req.body.target;
      userlog.timestamp = Date.now();
      userlog.save(function(err){
      if(err) {
          console.log("Error creating action entry for user- "+req.user._id);
          res.send(err);
        } else {
          console.log("Action entry created");
          res.json({name: req.user.id, action: req.body.action, status: 'success'});
        }
      });
    });
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}