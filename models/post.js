const mongoose = require('mongoose');

const { Schema } = mongoose;

const postModel = new Schema({
  title: String,
  authors: {
    type: Schema.Types.ObjectId,
    ref: 'author', // trên là "authors" thì dưới nên là "author"
  },
  date: {
    type: Date,
    required: true,
  },
});


module.exports = mongoose.model('article', postModel); //có thể khác tên, "article" sẽ tạo collection "articles" trong Atlas
// "postModel" chỉ là code name
