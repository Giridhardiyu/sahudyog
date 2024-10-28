const admin = require('firebase-admin');
const jwt = require('jsonwebtoken'); 

const checkAuth = async (req, res, next) => {
    const idToken = req.cookies.idToken;

    if (idToken) {
        console.log('Received ID Token:', idToken);

        try {
            
            const decodedToken = jwt.decode(idToken, { complete: true });
            console.log('Decoded Token:', decodedToken);

            
            const verifiedToken = await admin.auth().verifyIdToken(idToken);
            req.user = verifiedToken;
            return next();
        } catch (error) {
            console.error('Error verifying token:', error);
            res.clearCookie('idToken');
            if (req.path === '/profile') {
                return res.redirect('/signin');
            }
            return res.status(401).send({ message: 'Authentication failed, please log in again' });
        }
    } else {
        if (req.path === '/profile') {
            return res.redirect('/signin');
        }
        return res.status(401).send({ message: 'No token provided, please log in' });
    }
};

module.exports = checkAuth;