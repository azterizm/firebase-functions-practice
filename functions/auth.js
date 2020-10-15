const admin = require('firebase-admin');
const { auth } = admin;

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
