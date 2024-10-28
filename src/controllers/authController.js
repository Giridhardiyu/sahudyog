const { firebaseApp } = require('../../firebaseConfig')
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } = require('firebase/auth');
const nodemailer = require('nodemailer');
const checkAuth = require('../middlewares/checkAuth');

const db = admin.firestore();
const auth = getAuth(firebaseApp);
const { getStorage } = require('firebase-admin/storage');

const transporter = nodemailer.createTransport({
    service: 'gmail', // you can use any email service
    auth: {
        user: 'giridhardiyu@gmail.com',
        pass: 'vjbv tuxk deps pipl'
    }
});

exports.userSignup = async (req, res, next) => {
    const { email, password, fullName, username, skills, proficiency, role, bio} = req.body;

    try {
        // Create user with email and password in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await db.collection('users').doc(user.uid).set({
            fullName: fullName,
            username: username,
            skills: skills,
            proficiency: proficiency,
            role: role,
            bio: bio,
            honorScore: 0,
            email: email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Send a welcome email
        const mailOptions = {
            from: 'giridhardiyu@gmail.com',
            to: email,
            subject: 'Welcome to Our SkillShare Platform!',
            text: `Hello ${fullName},\n\nWelcome to SkillShare! We are thrilled to have you join our community. Start exploring projects, connect with collaborators, and build your honor score.\n\nBest regards,\nThe SkillShare Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Welcome email sent:', info.response);
            }
        });

        // Respond with the user data
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    uid: user.uid,
                    email: user.email,
                    fullName: fullName,
                    username: username,
                }
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
        console.log("Response: ", res);
    }
};

exports.userSignin = async (req, res, next) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const user = userCredential.user;
        
        console.log(user)
        // Get Firebase ID token
        const idToken = await user.getIdToken(/* forceRefresh */ true);
        console.log(idToken);

        const decodedToken = jwt.decode(idToken, { complete: true });
        console.log('Decoded Token:', decodedToken);

        res.status(201).json({
            status: 'success',
            data: {
                user: user,
                token: idToken,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.userData = async (req, res, next) => {
    const userId = req.user.uid;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userData = userDoc.data();
        res.json({ user: userData, userId: userId });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
}