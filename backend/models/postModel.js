const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		// Core Fields
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		content: {
			type: String,
			required: true,
			maxlength: 1000,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		// Metadata
		status: {
			type: String,
			enum: {
				values: ['new', 'active', 'closed'],
				message: 'Status invalid',
			},
			default: 'new',
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true }, // Include virtuals when converting to JSON
		toObject: { virtuals: true }, // Include virtuals when converting to objects
	}
);

// Virtual for Comments
postSchema.virtual('comments', {
	ref: 'Comment', // The model to use
	localField: '_id', // Find comments where `localField`
	foreignField: 'post', // is equal to `foreignField`
	justOne: false, // Set to false for array of comments
});

// Indexes
postSchema.index({ title: 'text', description: 'text' });
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1 });

// Query Helpers
postSchema.query.active = function () {
	return this.where({ status: 'active' });
};
postSchema.query.new = function () {
	return this.where({ status: 'new' });
};
postSchema.query.blocked = function () {
	return this.where({ status: 'closed' });
};
postSchema.query.liked = function (userId) {
	return this.where({ likes: userId });
};

postSchema.pre('findOneAndDelete', async function (next) {
	const post = await this.model.findOne(this.getFilter());
	await mongoose.model('Comment').deleteMany({ post: post._id });
	next();
});

module.exports = mongoose.model('Post', postSchema);
