const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
    },
  ],
});

questionSchema.methods.addOption = function(option) {
    this.options.push(option);
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
