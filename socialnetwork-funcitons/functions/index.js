const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const config = {
	apiKey: 'AIzaSyD96SZ5BzQx_CpXghUWlVm4q_JzWv26PtI',
	authDomain: 'socialnework-2500b.firebaseapp.com',
	projectId: 'socialnework-2500b',
	storageBucket: 'socialnework-2500b.appspot.com',
	messagingSenderId: '54603655443',
	appId: '1:54603655443:web:ea5f252448a9e4514f92e6',
	measurementId: 'G-C7G7FFX41Y',
};

const app = require('express')();
const firebase = require('firebase');

firebase.initializeApp(config);

const db = admin.firestore();

app.get('/posts', (req, res) => {
	db.collection('posts')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let posts = [];
			data.forEach((doc) => {
				posts.push({
					postId: doc.id,
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
				});
			});
			return res.json(posts);
		})
		.catch((err) => console.error(err));
});

app.post('/post', (req, res) => {
	const newPost = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		createdAt: new Date().toISOString(),
	};

	db.collection('posts')
		.add(newPost)
		.then((doc) => {
			res.json({ message: `document ${doc.id} created successfully` });
		})
		.catch((err) => {
			res.status(500).json({ error: 'something went wrong' });
			console.error(err);
		});
});

//Signup route
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle,
	};

	//TODO: validate data
	let token, userId;
	db.doc(`/users/${newUser.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return res
					.status(400)
					.json({ handle: 'this handle is already taken' });
			} else {
				return firebase
					.auth()
					.createUserWithEmailAndPassword(
						newUser.email,
						newUser.password
					);
			}
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idToken) => {
			token = idToken;
			const UserCredentials = {
				handle: newUser.handle,
				email: newUser.email,
				createdAt: new Date().toISOString(),
				userId,
			};
			return db.doc(`/users/${newUser.handle}`).set(UserCredentials);
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res
					.status(400)
					.json({ email: 'Email is already in use' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
});

exports.api = functions.region('europe-west3').https.onRequest(app);
