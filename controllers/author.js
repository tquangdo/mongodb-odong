
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const AuthorModel = require('../models/author');

exports.params = async function (req, res, next, id) {
  await AuthorModel.findById(id)
    .populate('articles')
    .exec()
    .then((author) => {
      if (!author) {
        return res.status(400).send('There is no author with that id');
      }
      req.author = author;
      next();
    }, (err) => {
      res.status(400).send('There is an error with that request');
      res.send(err);
    });
};

exports.get = async function (req, res) {
  await AuthorModel.find({}).populate('articles')
    .exec()
    .then((authors) => {
      res.json(authors);
    }, (err) => {
      res.send(err);
    });
};


exports.post = async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  await AuthorModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashPassword,
    email: req.body.email,
  })
    .then((author) => {
      res.json(author);
    })
    .catch((err) => {
      res.send(err);
    })
};

exports.getOne = async function (req, res) {
  const author = await req.author;

  res.json(author);
};

exports.update = async function (req, res) {
  const author = await req.author;
  const updateAuthor = await req.body;

  _.merge(author, updateAuthor);

  await author.save((err, saved) => {
    if (err) {
      return res.status(400).send('author not Updated');
    }

    return res.json(saved);
  });
};

// chỉ delete "authors" nhưng KO delete "articles>authors[]"
exports.delete = async function (req, res) {
  const author = await req.author;

  await author.remove((err, removed) => {
    if (err) {
      return res.status(400).send('No author with that ID');
    }

    return res.json(removed);
  });
};
