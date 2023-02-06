import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { getOrders, addOrder } from '../../api/ordersApi'
import { getLocations } from '../../api/locationsApi'
import { getTerms } from '../../api/termsApi'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'


const OrdersList = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const [newLocation, setNewLocation] = useState('')
    const [newTerm, setNewTerm] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newApatmentNumber, setNewApatmentNumber] = useState('')

    const { data: orderData, isError: isOrderError } = useQuery(["orders"], () => getOrders(null, axiosPrivate))

    const { data: locationData } = useQuery(["locations"], () => getLocations(null, axiosPrivate))

    const { data: termData } = useQuery(["terms"], () => getTerms(null,null,null,axiosPrivate))

    const addOrderMutation = useMutation(async (orderDocument) => addOrder(orderDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("orders")
            queryClient.refetchQueries({ queryKey: ['orders'], type: 'active' })
        }
    })

    const deleteOrderMutation = useMutation(async (body) => {
        return await axios.delete("http://localhost:3500/orders", { data: body })
    }, {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("orders")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        addOrderMutation.mutate({ description: newDesc, location: newLocation, apartmentNumber: newApatmentNumber, term: newTerm })
        setNewDesc('')
        setNewLocation('')
        setNewTerm('')
        setNewApatmentNumber('')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter a new order</label>
                <div>
                    <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Enter desc"
                    />
                    <input
                        type="text"
                        value={newApatmentNumber}
                        onChange={(e) => setNewApatmentNumber(e.target.value)}
                        placeholder="Enter apartment number"
                    />
                    <select
                        id="locations"
                        name="locations"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                    >
                        {locationData?.map((location) => <option key={location._id} value={location._id}>{location.abbrev}</option>)}
                    </select>
                    <select
                        id="terms"
                        name="terms"
                        value={newTerm}
                        onChange={(e) => setNewTerm(e.target.value)}
                    >
                        {termData?.map((term) => <option key={term._id} value={term._id}>{term.user.username} {term.date}</option>)}
                    </select>
                </div>
                <button>ADD</button>
            </form>



            {isOrderError && <p>Not found</p>}
            {!isOrderError &&
                <ul>
                    {orderData?.map((order, i) => <li key={order._id}>{["Zlecenie nr: ", order.ticket, " - ", order.location.address.streetName, " ", order.location.address.buildingNumber, order.apartmentNumber ? "/" : "", order.apartmentNumber, " - ", order.description, " - ", order.term?.date, " ", order._id]}
                        <Link to={`/dash/orders/edit/${order._id}`}>Edytuj</Link>
                        <button onClick={() => deleteOrderMutation.mutate({ id: order._id })}>DELETE</button></li>)}
                </ul>
            }
        </div>
    )
}

export default OrdersList
