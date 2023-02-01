import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, updateOrder } from '../../api/ordersApi'
import { useState } from 'react'
import { getLocations } from '../../api/locationsApi'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


const ViewOrder = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const { id } = useParams()

    const [location, setLocation] = useState(null)
    const [address, setAddress] = useState('')
    const [desc, setDesc] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')

    const { data, isLoading, isError } = useQuery(["order"], async () => getOrders(id, axiosPrivate), {
        onSuccess: (data) => {
            setAddress([data[0].location.address.streetName, " ", data[0].location.address.buildingNumber, data[0].apartmentNumber ? "/" : '', data[0].apartmentNumber])
            setDesc(data[0].description)
            setLocation(data[0].location)
            setApartmentNumber(data[0].apartmentNumber)
        }
    })

    const { data: locationData, isLoading: isLocationLoading, isError: isLocationError } = useQuery(["locations"], () => getLocations(axiosPrivate))



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
                <p>{data[0].term.date}</p>
                <h1>{address}</h1>
                <p>{desc}</p>

            </div>)

    )
}

export default ViewOrder