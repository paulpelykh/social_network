const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

const {
	getAllPosts,
	postOnePost,
	deletePost,
	getPost,
	commentOnPost,
	likePost,
	unlikePost,
} = require('./handlers/posts');
const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead,
} = require('./handlers/users');
const fbAuth = require('./util/fbAuth');

//Post routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOnePost);
app.delete('/post/:postId', FBAuth, deletePost);
app.get('/post/:postId', getPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);

//users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', fbAuth, markNotificationsRead);

exports.api = functions.region('europe-west3').https.onRequest(app);

exports.createNotificationOnLike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onCreate((snapshot) => {
		db.doc(`/posts/${snapshot.data().postId}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						screamId: doc.id,
					});
				}
			})
			.then(() => {
				return;
			})
			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.deleteNotificationOnUnLike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onDelete((snapshot) => {
		db.doc(`/notifications/${snapshot.id}`)
			.delete()
			.then(() => {
				return;
			})
			.catch((err) => {
				console.error(err);
				return;
			});
	});

exports.createNotificationOnComment = functions
	.region('europe-west3')
	.firestore.document('comments/{id}')
	.onCreate((snapshot) => {
		db.doc(`/posts/${snapshot.data().postId}`)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recipient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						screamId: doc.id,
					});
				}
			})
			.then(() => {
				return;
			})
			.catch((err) => {
				console.error(err);
				return;
			});
	});
