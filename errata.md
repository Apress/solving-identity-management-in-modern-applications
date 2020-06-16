# Errata for *Solving Identity Management in Modern Applications*

***

On **cover** Missing attribution for source code:
 
The cover should have acknowledged:  **“With code by Abhishek Hingnikar”**.

***

On **page xxii** Updated acknowledgement for use of identicons

The acknowledgements on page xxii should have included our gratitude to Vittorio Bertocci, Guillermo Mesyngier and the Auth0 graphics team for the identicon project to create a visual language for identity.  The Login credentials, ID Token, Access Token, Refresh Token, and Cookie icons used in the diagrams are from https://identicons.dev/ and used subject to MIT License, a copy of which is in the github repo for this book.

***

On **page 135** Updated description of how email addresses for permissions are handled:
 
On page 135 of the paperback edition, the statement, “In the interest of privacy, instead of sharing the full email, a salted hash is stored and acquired” should read: **“In the interest of privacy, instead of sharing the full email with each user accessing the file, only the owner has access to the whole list of permissions”**

***

On **page 135** Updated sample source code:

On page 135 of the paperback edition, in code the “hash(getDomain(email))” should be “getDomain(user.email)”. The complete updated code should be the following


```
function addDataToAccessToken(user, context, callback) {
  function getDomain(email) {
    if (!email) {
      throw new UnauthorizedError("No Email Found");
    }
    return email.split("@")[1];
  }

  try {
    context.accessToken["https://api.localhost/teamId"] = getDomain(user.email);
    context.accessToken["https://api.localhost/email"] = user.email;
    context.accessToken["https://api.localhost/email_verified"] = user.email_verified;
  } catch (e) {
    callback(e);
    return;
  }

  return callback(null, user, context);
}
```

***
