import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getLocations, updateLocation } from '../../api/locationsApi'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


const EditLocation = () => {
    
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const { id } = useParams()
    const [desc, setDesc] = useState('')

    const { data, isLoading, isError } = useQuery(["location"], async () => getLocations(id, axiosPrivate), {
        onSuccess: (data) => {
            setDesc(data[0].description)
        }
    })

    const updateLocationMutation = useMutation(async (locationDocument) => updateLocation(locationDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("location")
        }
    })
    
    const handleUpdate = () => {
        updateLocationMutation.mutate({
            id: id,
            description: desc
        })
        navigate('/dash/locations')
    }

    if (isLoading) return (
        <div>Loading</div>
    )
    if (isError) return (
        <div>Error</div>
    )
    
    return (

        data[0] && data && (
            <div>
                <Link to={'/dash/locations'}>Wróć do listy lokalizacji</Link>
                <h2>{data && data[0].abbrev}</h2>
                <p>{data && [data[0].address.streetName, ' ', data[0].address.buildingNumber, ', ', data[0].address.zipCode, ' ', data[0].address.cityName]}</p>
                <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <button onClick={handleUpdate}>Zapisz</button>
            </div>)

    )
}

export default EditLocation