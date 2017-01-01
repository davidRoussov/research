var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	topicName: {type: String},
	parentID: {type: String},
	rank: {type: Number},
	height: {type: Number}
});

var researchSchema = new mongoose.Schema({
	topics: [topicSchema]
});

mongoose.model('Topic', topicSchema);
mongoose.model('Research', researchSchema);