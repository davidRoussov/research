var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new mongoose.Schema({
	topicName: {type: String},
	parentID: {type: String},
	rank: {type: Number},
	height: {type: Number}
});

var documentSchema = new mongoose.Schema({
	topicIDs: [{type: String}],
	link: {type: String},
	title: {type: String},
	date: {type: String},
	source: {type: String},
	summary: {type: String}
});

var researchSchema = new mongoose.Schema({
	topics: [topicSchema],
	research: [documentSchema]
});

mongoose.model('Topic', topicSchema);
mongoose.model('Research', researchSchema);
mongoose.model('Document', documentSchema);