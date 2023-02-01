const Term = require('../models/Term')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all terms
// @route GET /terms
// @access Private
const getAllTerms = asyncHandler(async (req, res) => {
    

    // Get all terms from MongoDB
    const terms = await Term.find({...req.query}).lean().populate('user', '-password').sort({date:1})

    // If no terms 
    if (!terms?.length) {
        return res.status(400).json({ message: 'No terms found' })
    }

    res.json(terms)
})

const getDateTerms = asyncHandler(async (req, res) => {
    
    // Get all terms from MongoDB
    const dateStartFilter = new Date(req.query.date)
    dateStartFilter.setHours(0,0,0,0)
    const dateEndFilter = new Date(req.query.date)
    dateEndFilter.setHours(23,59,59,999)
    const terms = await Term.find({date: {$gte: dateStartFilter, $lt: dateEndFilter}}).lean().populate('user', '-password').sort({date:1})
    
    // If no terms 
    if (!terms?.length) {
        return res.status(400).json({ message: 'No terms found' })
    }

    res.json(terms)
})

// @desc Create new term
// @route POST /terms
// @access Private
const createNewTerm = asyncHandler(async (req, res) => {
    const { date,  user, status } = req.body
    console.log(date, user, status)
    // Confirm data
    if (!date || !user ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate term
    
    const duplicate = await Term.findOne({ date,  user }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate term' })
    }

    const termObject = { date: Date.parse(date), user, status }

    // Create and store new term 
    const term = await Term.create(termObject)

    if (term) { //created 
        res.status(201).json({ message: `New term ${date} for ${user} created` })
    } else {
        res.status(400).json({ message: 'Invalid term data received' })
    }
})

// @desc Update a term
// @route PATCH /terms
// @access Private
const updateTerm = asyncHandler(async (req, res) => {
    const { id, date, startTime, endTime, user} = req.body

    // Confirm data 
    if (!id || !date || !startTime || !endTime || !user ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the term exist to update?
    const term = await Term.findById(id).exec()

    if (!term) {
        return res.status(400).json({ message: 'Term not found' })
    }

    // Check for duplicate 
    const duplicate = await Term.findOne({ date, startTime, endTime, user }).lean().exec()

    // Allow updates to the original term 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate termname' })
    }

    term.date = date
    term.startTime = startTime
    term.endTime = endTime
    term.user = user

    const updatedTerm = await term.save()

    res.json({ message: `${updatedTerm._id} updated` })
})

// @desc Delete a term
// @route DELETE /terms
// @access Private
const deleteTerm = asyncHandler(async (req, res) => {
    const { id } = req.body
    console.log(req.body)
    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Term ID Required' })
    }

    // Does the term exist to delete?
    const term = await Term.findById(id).exec()

    if (!term) {
        return res.status(400).json({ message: 'Term not found' })
    }

    const result = await term.deleteOne()

    const reply = `Term with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllTerms,
    getDateTerms,
    createNewTerm,
    updateTerm,
    deleteTerm
}