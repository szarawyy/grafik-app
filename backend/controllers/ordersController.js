const Order = require('../models/Order')
const asyncHandler = require('express-async-handler')

// @desc Get all orders
// @route GET /orders
// @access Private
const getAllOrders = asyncHandler(async (req, res) => {
    // Get all orders from MongoDB
    const orders = await Order.find({...req.query}).lean().populate(['location', 'term'])
    
    // If no orders 
    if (!orders?.length) {
        return res.status(400).json({ message: 'No orders found' })
    }
    res.json(orders)
})

// @desc Create new order
// @route POST /orders
// @access Private
const createNewOrder = asyncHandler(async (req, res) => {
    const { location, description, term, apartmentNumber, modifiedBy } = req.body
    console.log("location", location, "description",description, "term",term, "apartmentNumber",apartmentNumber)
    // Confirm data
    if (!location) {
        return res.status(400).json({ message: 'Location is required' })
    }

    // Check for duplicate ordername
    const duplicate = await Order.findOne({ location, apartmentNumber }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate order' })
    }

    const orderObject = { location, description, term, apartmentNumber, modifiedBy }

    // Create and store new order 
    const order = await Order.create(orderObject)

    if (order) { //created 
        res.status(201).json({ message: `New order at ${location} created` })
    } else {
        res.status(400).json({ message: 'Invalid order data received' })
    }
})

// @desc Update a order
// @route PATCH /orders
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
    const { id, location, term, description, apartmentNumber, modifiedBy } = req.body
    
    // Confirm data 
    if ( !id ) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    //Does the order exist to update?
    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }

    // Check for duplicate 
    const duplicate = await Order.findOne({ location, term, apartmentNumber }).lean().exec()

    // Allow updates to the original order 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate order' })
    }

    if (term === null) {
        order.term = undefined
    }

    location && (order.location = location)
    apartmentNumber && (order.apartmentNumber = apartmentNumber)
    description && (order.description = description)
    term && (order.term = term)
    order.modifiedBy = modifiedBy
    const updatedOrder = await order.save()

    res.json({ message: `${updatedOrder.location} updated` })
})

// @desc Delete a order
// @route DELETE /orders
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.body
    console.log(id)
    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Order ID Required' })
    }

    // Does the order exist to delete?
    const order = await Order.findById(id).exec()

    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }

    const result = await order.deleteOne()

    const reply = `Order at ${result.location}, ${result.term} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllOrders,
    createNewOrder,
    updateOrder,
    deleteOrder
}