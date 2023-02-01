const Location = require('../models/Location')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all locations
// @route GET /locations
// @access Private
const getAllLocations = asyncHandler(async (req, res) => {
    // Get all locations from MongoDB
    const locations = await Location.find().lean().sort({abbrev:1})

    // If no locations 
    if (!locations?.length) {
        return res.status(400).json({ message: 'No locations found' })
    }

    res.json(locations)
})

// @desc Create new location
// @route POST /locations
// @access Private
const createNewLocation = asyncHandler(async (req, res) => {
    const { abbrev, description, address } = req.body
    
    // Confirm data
    if (!abbrev || !address) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate locationname
    const duplicate = await Location.findOne({ abbrev }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate address abbreviation' })
    }

    const locationObject = { abbrev, description, address }

    // Create and store new location 
    const location = await Location.create(locationObject)

    if (location) { //created
        res.status(201).json({ object: location, message: `New location ${address.streetName} ${address.buildingNumber} (${abbrev}) created` })
    } else {
        res.status(400).json({ message: 'Invalid location data received' })
    }
})

// @desc Update a location
// @route PATCH /locations
// @access Private
const updateLocation = asyncHandler(async (req, res) => {
    const { id, locationname, roles, password } = req.body

    // Confirm data 
    if (!id || !locationname || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the location exist to update?
    const location = await Location.findById(id).exec()

    if (!location) {
        return res.status(400).json({ message: 'Location not found' })
    }

    // Check for duplicate 
    const duplicate = await Location.findOne({ locationname }).lean().exec()

    // Allow updates to the original location 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate locationname' })
    }

    location.locationname = locationname
    location.roles = roles

    if (password) {
        // Hash password 
        location.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedLocation = await location.save()

    res.json({ message: `${updatedLocation.locationname} updated` })
})

// @desc Delete a location
// @route DELETE /locations
// @access Private
const deleteLocation = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Location ID Required' })
    }

    // Does the location exist to delete?
    const location = await Location.findById(id).exec()

    if (!location) {
        return res.status(400).json({ message: 'Location not found' })
    }

    const result = await location.deleteOne()

    const reply = `Locationname ${result.locationname} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllLocations,
    createNewLocation,
    updateLocation,
    deleteLocation
}