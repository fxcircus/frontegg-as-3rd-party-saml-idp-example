const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 5000;

// "Domain name" from Frontegg Portal ➜ [ENVIRONMENT] ➜ Keys & domains ➜ Domains
const fronteggAppUrl = 'app-xxx.frontegg.com';

// SAML Configuration
const samlConfig = {
    path: '/login/callback', // Callback URL to handle the SAML response
    entryPoint: `https://${fronteggAppUrl}/oauth/sso/SingleSignOnService`, // SSO URL
    issuer: 'FronteggThridPartySamlExample', // SP Entity ID
    cert: `-----BEGIN CERTIFICATE-----
// SAML certificate from the app you created on the Frontegg Portal
-----END CERTIFICATE-----`,
};

// Configure Passport to use the SAML strategy
passport.use(new SamlStrategy(samlConfig, (profile, done) => {
    // Here you can handle the user profile returned by the IdP
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>SSO with Frontegg</h1>
        <button onclick="window.location.href='/login'">Sign in with SSO</button>
    `);
});

// SAML login route
app.get('/login', passport.authenticate('saml'));

// SAML callback route
app.post('/login/callback', passport.authenticate('saml', {
    failureRedirect: '/',
}), (req, res) => {
    // Successful authentication
    res.redirect('/profile');
});

// Profile route
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    // Extracting nameID from the user object
    const nameID = req.user.nameID || 'User'; // Fallback to 'User' if nameID is not available

    res.send(`
        <h1>Success!</h1>
        <h2>Logged in! email: ${nameID}</h1>
        <h3>Full Response:</h2>
        <pre>${JSON.stringify(req.user, null, 2)}</pre>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
