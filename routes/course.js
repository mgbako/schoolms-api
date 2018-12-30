const express = require('express');
const router = express.Router();

courseController = require('../controllers/course');

router.get('', courseController.index);

router.post('', courseController.create);

router.put('/:id', courseController.update);

router.delete('/:id', courseController.delete);

module.exports = router;