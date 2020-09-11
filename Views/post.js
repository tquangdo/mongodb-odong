
const express = require('express');
const postController = require('../controllers/post');

const postRouter = express.Router();

postRouter.param('id', postController.params);


postRouter.route('/articles')
  .get(postController.get);

postRouter.route('/articles/:id')
  .delete(postController.delete)
  .get(postController.getOne);

postRouter.route('/authors/:authorID/articles')
  .post(postController.postAPI);

postRouter.route('/authors/:authorId/articles/:articleId')
  .put(postController.update);


module.exports = postRouter;
