import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, updateOrder, deleteOrder } from '../../api/ordersApi'
import { useState } from 'react'
import { getLocations } from '../../api/locationsApi'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from "../../hooks/useAuth"


const EditOrder = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { id } = useParams()
    const { auth } =useAuth()
    const [location, setLocation] = useState(null)
    const [address, setAddress] = useState('')
    const [desc, setDesc] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')

    const { data, isLoading, isError } = useQuery(["order"], async () => getOrders(id, axiosPrivate), {
        onSuccess: (data) => {
            setAddress([data[0].location?.address.streetName, " ", data[0].location?.address.buildingNumber, data[0].apartmentNumber ? "/" : '', data[0].apartmentNumber])
            setDesc(data[0].description)
            setLocation(data[0].location)
            setApartmentNumber(data[0].apartmentNumber)
        }
    })

    const { data: locationData, isLoading: isLocationLoading, isError: isLocationError } = useQuery(["locations"], () => getLocations(axiosPrivate))

    const deleteOrderMutation = useMutation(async (orderId) => deleteOrder( orderId, axiosPrivate ), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("order")
        }
    })

    const updateOrderMutation = useMutation(async (orderDocument) => updateOrder(orderDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("order")
        }
    })

    const saveEdition = (e) => {
        e.preventDefault()
        updateOrderMutation.mutate({
            id: id,
            description: desc,
            location: location._id,
            apartmentNumber: apartmentNumber,
            modifiedBy: auth.user
        })
    }

    const handleDelete = () => {
        deleteOrderMutation.mutate({id: id})
        navigate('/dash/schedule')
    }


    if (isLoading || isLocationLoading) return (
        <div>Loading</div>
    )
    if (isError || isLocationError) return (
        <div>Error</div>
    )

    return (

        data[0] && locationData && (
            <div>
                <Link to={'/dash/schedule'}>Wróć do listy zleceń</Link>
                <h2>Zlecenie nr {data && data[0].ticket}</h2>
                <h1>{address}</h1>
                <form onSubmit={saveEdition}>
                    <textarea
                        type="text"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Enter description"
                    />
                    <select
                        id="locations"
                        name="locations"
                        value={JSON.stringify(location)}
                        onChange={(e) => setLocation(JSON.parse(e.target.value))}
                    >
                        {locationData?.map((locationElement) => <option key={locationElement._id} value={JSON.stringify(locationElement)}>{locationElement.abbrev}</option>)}
                    </select>
                    <input
                        type="text"
                        value={apartmentNumber}
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        placeholder="Enter apartment number"
                    />
                    <button>Save</button>
                </form>
                <button onClick={() => handleDelete()}>Delete</button>
                <h1>{location?.abbrev}</h1>
                <p>{['Zmodyfikowano ', new Date(data[0].modifiedAt).toLocaleString(), ' przez ', data[0].modifiedBy]}</p>
            </div>)

    )
}

export default EditOrder