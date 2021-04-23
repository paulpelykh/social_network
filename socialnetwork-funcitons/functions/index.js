const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

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
} = require('./handlers/users');

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

exports.api = functions.region('europe-west3').https.onRequest(app);
