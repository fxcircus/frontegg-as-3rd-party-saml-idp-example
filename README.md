# Frontegg SAML SSO Example

This is a simple Node.js application that demonstrates how to implement SAML Single Sign-On (SSO) using Frontegg as the Identity Provider (IdP). The application uses the `passport-saml` library for SAML authentication.

Refer to the [Frontegg IDP via SAML Guide](https://developers.frontegg.com/guides/management/frontegg-idp/via-saml) for further documentation.

## Features

-  SSO authentication using SAML with Frontegg.
-  Displays user information after successful login.


## Frontegg account Setup
1. Login to your Frontegg account. 
2. Navigate to `Frontegg Portal ➜ [ENVIRONMENT] ➜ Authentication ➜ Hosted` and add the following URLs to the `Hosted login` list:
    ```
    http://localhost:5000/login/callback
    http://localhost:5000/logout
    ```
3. Navigate to `Authentication ➜ SSO ➜ Identity provider ➜ SAML applications ➜ Add new application`,
   Set the Application name you want, and then add:
   ```
    SP entity ID = FronteggThridPartySamlExample
    SP ACS URL = http://localhost:5000/login/callback
    ```
    Click `Next` and save the certificate for the code setup on the next step.

## Code Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fxcircus/frontegg-as-3rd-party-saml-idp-example.git
   cd frontegg-as-3rd-party-saml-idp-example
   npm install
   ```

2. **Update the `server.js` file**:

    ```
    // "Domain name" from Frontegg Portal ➜ [ENVIRONMENT] ➜ Keys & domains ➜ Domains
    const fronteggAppUrl = 'app-frtqiefxjqn9.frontegg.com';

    const samlConfig = {
        path: '/login/callback',
        entryPoint: `https://${fronteggAppUrl}/oauth/sso/SingleSignOnService`,
        issuer: 'FronteggThridPartySamlExample',
        cert: `-----BEGIN CERTIFICATE-----
        // SAML certificate from the app you created on the Frontegg Portal
        -----END CERTIFICATE-----`,
    };
    ```

3. Run the Application - `node server.js`
4. Open your browser and navigate to `http://localhost:5000`
5. Login with your Frontegg user.
   You should get redirected back and see a success screen:

![Alt text](/image.png)



## Technologies Used

-  Node.js
-  Express
-  Passport.js
-  passport-saml
-  Body-parser
-  Express-session
