
const _ = require('lodash');
const AuthorModel = require('../models/author');
const PostModel = require('../models/post');

exports.params = async function (req, res, next, id) {
  console.log(id);
  await PostModel.findById(id)
    .populate('authors')
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(400).send(' post with that Particular id');
      }
      req.post = post;
      next();
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.get = async function (req, res) {
  await PostModel.find({})
    .populate('authors')
    .exec()
    .then(articles => {
      res.json(articles);
    }, (err) => {
      res.send(err);
    });
};

exports.getOne = async function (req, res) {
  const post = await req.post;

  res.json(post);
};

// chỉ delete "articles" nhưng KO delete "authors>articles[]"
exports.delete = async function (req, res) {
  await PostModel.remove((req.post), (err, removed) => {
    if (err) {
      res.status(400).send('post not deleted');
    } else {
      res.json(removed);
    }
  });
};


exports.postAPI = async function (req, res) {
  const authorId = await req.params.authorID;
  const postObject = await req.body;
  const newPost = new PostModel(postObject);

  await AuthorModel.findOne({ _id: authorId }, async (err, foundAuthor) => {
    if (!foundAuthor) {
      return err;
    }
    foundAuthor.articles.push(newPost);
    newPost.authors = foundAuthor;
    await newPost.save((error, savedPost) => { //save "articles>authors[]"
      if (error) {
        return error;
      }
      return res.json(savedPost);
    });
    await foundAuthor.save((error, savedAuthor) => { //save "authors>articles[]"
      if (error) {
        return error;
      }
      savedAuthor;
    });
    return foundAuthor;
  });
};

exports.update = function (req, res) {
  const newAuthorId = req.params.authorId; //authorId trên link API -> LeB
  const { articleId } = req.params;
  const newPost = req.body;

  PostModel.findOne({ _id: articleId }, (err, post) => { //tìm article có articleId trên link API -> Titanic
    if (!post) {
      return err;
    }

    const oldAuthorID = post.authors._id; //authorId trong article "Titanic" -> LeB

    AuthorModel.findById(oldAuthorID)
      .then((oldAuthor) => {
        if (!oldAuthor) {
          return res.status(400).send('No Author with that Particular id');
        }

        const index = oldAuthor.articles.indexOf(articleId); //"LeB">articles[0,1...]

        if (index > -1) {
          oldAuthor.articles.splice(index, 1); // xóa "LeB">articles["Titanic"] 
          //nếu newAuthor khác "LeB" nghĩa là move "LeB">articles["Titanic"] -> "khác">articles["Titanic XXX"]
        }

        oldAuthor.save((error, savedAuthor) => {
          if (error) {
            return error;
          }
          return savedAuthor;
        });
        return oldAuthor;
      });


    AuthorModel.findById(newAuthorId)
      .then((newAuthor) => {
        if (!newAuthor) {
          return err;
        }

        newAuthor.articles.push(post); // add "khác">articles["Titanic"]
        newAuthor.save((error, savedAuthor) => {
          if (error) {
            return error;
          }
          return savedAuthor;
        });

        post.authors = newAuthor;

        //merge() của lodash
        _.merge(post, newPost); // merge articles>authors["khác"] có nội dung article mới: "Titanic"->"Titanic XXX"
        post.save((error, saved) => {
          if (error) {
            return error;
          }
          return res.json(saved);
        });
        return newAuthor;
      });
    return post;
  });
};
