const express = require('express');
const controller = require('../controllers/categoriaController');
const { validateId } = require('../middlewares/validation');

const router = express.Router();

router.route('/').get(controller.findAll).post(controller.create);
router.route('/:id').all(validateId).get(controller.findById).put(controller.update).delete(controller.remove);

module.exports = router;
