import axios from "axios"

const termsApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getTerms = async (id, date, user, axiosApi) => {
    const res = await axiosApi.get('/terms', {
        params:
        {
            ...(id && { _id: id }),
            ...(user && { user: user }),
            ...(date && { date: date })
        }
    })
    return res.data
}
export const getTermsByDate = async (date, axiosApi) => {
    const res = await axiosApi.get('/terms/date', {
        params:
        {
            ...(date && { date: date })
        }
    })
    return res.data
}

export const addTerm = async (term, axiosApi) => {
    return await axiosApi.post('/terms', term)
}

export const updateTerm = async (term) => {
    return await termsApi.patch('/terms', term)
}

export const deleteTerm = async (termId, axiosApi) => {
    return await axiosApi.delete('/terms', { data: termId })
}

export default termsApi