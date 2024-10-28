const admin = require('firebase-admin');

async function checkAdmin(req, res, next) {
    const user = req.user; // assuming the user is already authenticated and set in req.user

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Get the user's custom claims
        const userRecord = await admin.auth().getUser(user.uid);
        const isAdmin = userRecord.customClaims && userRecord.customClaims.admin === true;
        console.log(isAdmin);

        if (!isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next(); // user is admin, proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking admin status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = checkAdmin;
