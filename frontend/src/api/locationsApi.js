import axios from "axios"

const locationsApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getLocations = async (id, axiosApi) => {
    const res = await axiosApi.get('/locations', {
        params:
        {
            ...(id && { _id: id })
        }
    })
    return res.data
}

export const addLocation = async (location, axiosApi) => {
    return await axiosApi.post('/locations', location)
}

export const updateLocation = async (location, axiosApi) => {
    return await axiosApi.patch('/locations', location)
}

export const deleteLocation = async (locationId, axiosApi) => {
    return await axiosApi.delete('/locations', { data: locationId })
}

export default locationsApi