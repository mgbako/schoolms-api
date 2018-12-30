const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

feedController = require('../controllers/feed');

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',
[body('title').trim().isLength({min: 5}), body('content').trim().isLength({min: 5})],
feedController.addPost);

module.exports = router;