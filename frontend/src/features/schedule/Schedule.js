import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTermsByDate } from '../../api/termsApi'
import { getOrders, updateOrder } from '../../api/ordersApi'
import { getUsers } from '../../api/usersApi'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faBars, faCalendarPlus, faX, faCalendarMinus, faRefresh } from "@fortawesome/free-solid-svg-icons"

const Schedule = () => {

    const { auth } = useAuth()
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const [date, setDate] = useState(new Date())
    const [ifAssignMode, setIfAssignMode] = useState(false)
    const [ifUnassignMode, setIfUnassignMode] = useState(false)
    const [choosenOrder, setChoosenOrder] = useState(null)

    const { data: usersData } = useQuery(["fitters"], () => getUsers(auth.roles.includes('fitter') ? auth.user : null, axiosPrivate, { roles: ['fitter'] }))

    const { data: termsByDayData, isError: isTermsByDateError, refetch: refetchTerms } = useQuery(["terms", date], () => getTermsByDate(date, axiosPrivate), { retry: false })

    const { data: ordersData, refetch: refetchOrders } = useQuery(["orders"], () => getOrders(null, axiosPrivate))

    const hoursList = [...new Set(termsByDayData?.map((term) => term.date))].sort()

    const termsInSchedule = hoursList?.map((hour) =>
        usersData?.map((user) =>
            termsByDayData.filter(term => (term.date === hour && term.user?._id === user?._id))[0] || 'brak terminu'
        )
    )

    const ordersInSchedule = hoursList.map((hour) =>
        termsInSchedule[hoursList.indexOf(hour)]?.map((term, i) =>
            ordersData?.filter(order => (order.term?._id === term?._id && order.term))[0] || term
        )
    )

    const updateOrderMutation = useMutation(async (orderDocument) => updateOrder(orderDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("orders")
        }
    })

    const onChangeDate = (date) => {
        if (date) {
            setDate(new Date(date))
        } else {
            setDate(new Date())
        }
        refetchTerms()
    }

    const toogleUnassignMode = () => {
        setIfUnassignMode(!ifUnassignMode)
    }

    const unassignOrder = (order) => {
        updateOrderMutation.mutate({ id: order._id, modifiedBy: auth.user, term: null })
        setIfUnassignMode(!ifUnassignMode)
    }

    const chooseOrder = (order) => {
        setIfAssignMode(!ifAssignMode)
        setChoosenOrder(order)
    }

    const assignOrder = (term) => {
        updateOrderMutation.mutate({ id: choosenOrder._id, modifiedBy: auth.user, term: term })
        setIfAssignMode(!ifAssignMode)
    }


    return (
        <div>
            <span>
                <label>Podaj datę: </label>
                <input
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => onChangeDate(e.target.value)}
                />
            </span>

            { (isTermsByDateError && <><br/><br/><h2>Brak terminów dla podanej daty</h2><br/></>) ||
                <table>

                    <thead>
                        <tr>
                            <th><button className="dash-footer__button icon-button" onClick={() => refetchOrders()}><FontAwesomeIcon icon={faRefresh} /></button></th>
                            {usersData?.map((user, i) => <th key={i}>{user?.username}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {hoursList.map((hour) => <tr key={hour}>
                            <td>{[new Date(hour).getHours(), ":", new Date(hour).getUTCMinutes().toString().padEnd(2, "0")]}</td>
                            {ordersInSchedule[hoursList.indexOf(hour)]?.map((order, i) =>
                                <td key={i}>
                                    {order?.term ?
                                        <span><Link to={`/dash/orders/${auth.roles.includes('admin') || auth.roles.includes('editor') ? `edit/${order._id}` : order._id}`}>{[order?.location?.abbrev, order.apartmentNumber ? "/" : "", order.apartmentNumber]}</Link> {ifUnassignMode ? <button className="dash-footer__button icon-button" onClick={() => unassignOrder(order)}><FontAwesomeIcon icon={faCalendarMinus} /></button> : ''}</span>
                                        : order?.status === 'available' ?
                                            ifAssignMode ? <button className="dash-footer__button icon-button" onClick={() => assignOrder(order)}><FontAwesomeIcon icon={faPlus} /></button> : ''
                                            : <FontAwesomeIcon icon={faX} />
                                    }
                                </td>)}
                        </tr>)}
                    </tbody>
                </table>
            }
            
            {!auth.roles.includes('fitter') && <div>
                <h2>Zlecenia do umówienia</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nr</th><th>Skrót</th><th>Adres</th>
                            <th>
                                {(auth.roles.includes('admin') || auth.roles.includes('editor')) && <Link to='/dash/orders/add'><FontAwesomeIcon icon={faPlus} /></Link>}
                            </th>
                            {(auth.roles.includes('admin') || auth.roles.includes('editor')) && <><th><button className="dash-footer__button icon-button" onClick={() => toogleUnassignMode()}><FontAwesomeIcon icon={faCalendarMinus} /></button></th></>}
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData?.filter(order => (order.term === null || order.term === undefined)).map((order) => <tr key={order._id}>
                            <td>{order.ticket}</td><td>{[order.location.abbrev, order.apartmentNumber ? "/" : "", order.apartmentNumber]}</td><td>{[order.location.address.streetName, " ", order.location.address.buildingNumber, order.apartmentNumber ? "/" : "", order.apartmentNumber]}</td>
                            <td>
                                {(auth.roles.includes('admin') || auth.roles.includes('editor')) ?
                                    <Link to={`/dash/orders/edit/${order._id}`}><FontAwesomeIcon icon={faBars} /></Link>
                                    : <Link to={`/dash/orders/${order._id}`}><FontAwesomeIcon icon={faBars} /></Link>}
                            </td>
                            {(auth.roles.includes('admin') || auth.roles.includes('editor')) && <>
                                <td>
                                    <button
                                        className="dash-footer__button icon-button"
                                        onClick={() => chooseOrder(order)}
                                    >
                                        <FontAwesomeIcon icon={faCalendarPlus} />
                                    </button>
                                </td>
                            </>}
                        </tr>)}
                    </tbody>
                </table>
            </div>}
        </div >
    )
}

export default Schedule