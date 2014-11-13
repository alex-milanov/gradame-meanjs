'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ActivitySchema = new Schema({
    dateTime : { type: Date, default: Date.now },
    type : String,  // or 0,1,2
    createdBy : { type: Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    changes : [
      {
        field: String,
        value: Schema.Types.Mixed
      }
    ]
});

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
  status: { type: Number, default: 0},
  images: { type: [String] },
  date_created: { type: Date, default: Date.now },
  activities: [ ActivitySchema ]

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