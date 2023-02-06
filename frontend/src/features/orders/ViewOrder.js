import { useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../../api/ordersApi'
import { useState } from 'react'
import { getLocations } from '../../api/locationsApi'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


const ViewOrder = () => {
    const axiosPrivate = useAxiosPrivate()
    const { id } = useParams()
    const [address, setAddress] = useState('')
    const [desc, setDesc] = useState('')

    const { data, isLoading, isError } = useQuery(["order"], async () => getOrders(id, axiosPrivate), {
        onSuccess: (data) => {
            setAddress([data[0].location.address.streetName, " ", data[0].location.address.buildingNumber, data[0].apartmentNumber ? "/" : '', data[0].apartmentNumber])
            setDesc(data[0].description)
        }
    })

    const { data: locationData, isLoading: isLocationLoading, isError: isLocationError } = useQuery(["locations"], () => getLocations(null, axiosPrivate))

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
                <p>{data[0].term?.date}</p>
                <h1>{address}</h1>
                <p>{desc}</p>

            </div>)

    )
}

export default ViewOrder