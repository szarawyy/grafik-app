import axios from './axios'

const usersApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getUsers = async (user, axiosApi, params) => {
    const res = await axiosApi.get(`/users${user ? `?username=${user}` : ''}`, { params })
    return res.data
}

export const addUser = async (user, axiosApi) => {
    return await axiosApi.post('/users', user)
}

export const updateUser = async (user) => {
    return await usersApi.patch('/users', user)
}

export const deleteUser = async (userId, axiosApi) => {
    return await axiosApi.delete('/users', { data: userId })
}

export default usersApi