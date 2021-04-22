let db = {
	users: [
		{
			userId: 'user',
			email: 'user@gmail.com',
			handle: 'user',
			createdAt: '2021-03-16T18:23:05.463Z',
			imageUrl: 'images/asdf/jkl;',
			bio: 'Hello, my name is user, nice to meet you',
			website: 'https://user.com',
			location: 'Lviv UA',
		},
	],
	posts: [
		{
			userHandle: 'user',
			body: 'this is the post body',
			createdAt: '2021-03-16T18:23:05.463Z',
			likeCount: 5,
			commentCount: 2,
		},
	],
	comments: [
		{
			userHandle: 'user',
			postId: 'asldfjasdasdfasdf',
			body: 'nice one mate!',
			createdAt: '2020-03-15T10:59:52.798Z',
		},
	],
};

const userDetails = {
	// Redux data
	credentials: {
		userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
		email: 'user@email.com',
		handle: 'user',
		createdAt: '2019-03-15T10:59:52.798Z',
		imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
		bio: 'Hello, my name is user, nice to meet you',
		website: 'https://user.com',
		location: 'Lonodn, UK',
	},
	likes: [
		{
			userHandle: 'user',
			screamId: 'hh7O5oWfWucVzGbHH2pa',
		},
		{
			userHandle: 'user',
			screamId: '3IOnFoQexRcofs5OhBXO',
		},
	],
};
