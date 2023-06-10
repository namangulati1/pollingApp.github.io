const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
},
{
    toJSON: {
      virtuals: true, // Include virtual properties in the JSON output
    },
    toObject: {
      virtuals: true, // Include virtual properties when converting to an object
    },
});

optionSchema.virtual('link_to_vote').get(function () {
    return `http://localhost:3000/options/${this._id}/add_vote`;
  });

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;