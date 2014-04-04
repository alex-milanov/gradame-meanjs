'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SignalSchema = new Schema({
	type: String,
    //title: { type: String, default: '', trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    description: String,
    location: { type: [Number], index: '2dsphere' },
    address: String,
    status: String,
    images: { type: [String] },
	date_created: { type: Date, default: Date.now }
	
});



/**
 * Validations
 */
/* SignalSchema.path('title').validate(function(title) {
	return title.length;
}, 'Title cannot be blank');*/


/**
 * Statics
 */
SignalSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('user', 'displayName').exec(cb);
	}
};

mongoose.model('Signal', SignalSchema);