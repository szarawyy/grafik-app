const express = require('express')
const router = express.Router()
const termsController = require('../controllers/termsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(termsController.getAllTerms)
    .post(termsController.createNewTerm)
    .patch(termsController.updateTerm)
    .delete(termsController.deleteTerm)

    router.route('/date').get(termsController.getDateTerms)

module.exports = router