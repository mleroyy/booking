// MODEL DEFINITION
var mongoose = require('mongoose');
mongoose.Promise = global.Promise


var Schema = mongoose.Schema;

var roomSchema = new Schema
(
	{
		name: String,
		description: String,
		capacity: Number,
		equipements:
		[
			{
				name: String
			}
		],
		createdAt:
		{
			Date: Date
		},
		updatedAt:
		{
			Date: Date
		}
	}
);


var Room = mongoose.model('Room', roomSchema);

module.exports = Room;