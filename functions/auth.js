const admin = require('firebase-admin');
const { auth } = admin;

// module.exports = () => async (req, res, next) => {
//   // initialize the firebase application

//   try {
//     // retrieve the authorization header
//     const { authorization } = req.headers;
//     const { 1: idToken } = authorization.split('Bearer ');

//     // verify the user id token
//     const decodedToken = await auth().verifyIdToken(idToken);

//     // set it on the request variable so we can use on the next routes
//     req.locals = { user: decodedToken };

//     return next();
//   } catch (error) {
//     console.log(error);

//     return res.sendStatus(401);
//   }
// };

module.exports = () => async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { 1: idToken } = authorization.split('Bearer ');

    const decodedToken = await auth().verifyIdToken(idToken);

    req.locals = { user: decodedToken };
    return next();
  } catch (err) {
    console.log('error: ', error);
    return res.sendStatus(401);
  }
};
