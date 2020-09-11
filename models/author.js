const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  firstName: {
    type: String,
    min: 5,
    required: true,
  },
  lastName: {
    type: String,
    min: 5,
    required: true,
  },
  password: {
    type: String,
    min: 5,
    required: true,
  },
  email: {
    type: String,
    min: 6,
    required: true,
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'article', // trên là "articles" thì dưới nên là "article"
    },
  ],
}, {
  usePushEach: true,
});


module.exports = mongoose.model('author', authorSchema);
