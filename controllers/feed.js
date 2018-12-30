const { validationResult } = require('express-validator/check');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{title: 'First Post', content: 'This is the first post!'}]
  });
};

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed, entered incorrect data',
      erros: errors.array()
    })
  }
  const title = req.body.title;
  const content = req.body.content;

  // Create post in db
  res.status(201).json({
    message: 'Post Created Successfully',
    post: {
      _id: new Date().toISOString(), 
      title: title, 
      content: content,
      creator: {name: 'John'},
      createdAt: new Date()
    }
  });


}