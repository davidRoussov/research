var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var topicSchema = new mongoose.Schema({
	topicName: {type: String},
	parentID: {type: String},
	rank: {type: Number},
	height: {type: Number},
	notes: {type: String}
});

var documentSchema = new mongoose.Schema({
	topicIDs: [{type: String}],
	link: {type: String},
	title: {type: String},
	date: {type: String},
	source: {type: String},
	summary: {type: String},
	submissiontime: {type: Date}
});

var researchSchema = new mongoose.Schema({
	topics: [topicSchema],
	research: [documentSchema],
	recommendations: {type: String},
	userID: {type: String}
});




var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: String, //hash created from password
  created_at: {type: Date, default: Date.now}
})







mongoose.model('User', userSchema);
mongoose.model('Topic', topicSchema);
mongoose.model('Research', researchSchema);
mongoose.model('Document', documentSchema);