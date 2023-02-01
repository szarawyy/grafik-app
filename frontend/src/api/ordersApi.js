import axios from "axios"

const ordersApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getOrders = async (id, axiosApi) => {
    const res = await axiosApi.get('/orders', {
        params:
        {
            ...(id && { _id: id })
        }
    })
    return res.data
}

export const addOrder = async (order, axiosApi) => {
    return await axiosApi.post('/orders', order)
}

export const updateOrder = async (order, axiosApi) => {
    console.log(order)
    return await axiosApi.patch('/orders', order)
}

export const deleteOrder = async (orderId, axiosApi) => {
    return await axiosApi.delete('/orders', { data: orderId })
}

export default ordersApi