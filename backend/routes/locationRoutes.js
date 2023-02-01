const express = require('express')
const router = express.Router()
const locationsController = require('../controllers/locationsController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(locationsController.getAllLocations)
    .post(locationsController.createNewLocation)
    .patch(locationsController.updateLocation)
    .delete(locationsController.deleteLocation)

module.exports = router