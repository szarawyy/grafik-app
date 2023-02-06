import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { addTerm, deleteTerm, getTermsByDate } from '../../api/termsApi'
import { getUsers } from '../../api/usersApi'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const TermsList = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const [date, setDate] = useState(new Date())
    const [timeFrom, setTimeFrom] = useState(8)
    const [timeTo, setTimeTo] = useState(16)
    const [user, setUser] = useState(null)


    const { data: termData } = useQuery(["terms", date, user?._id], () => getTermsByDate(date, axiosPrivate))

    const { data: userData } = useQuery(["users"], () => getUsers(null, axiosPrivate, { roles: ["fitter"] }))

    const addTermMutation = useMutation((termDocument) => addTerm(termDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("terms")
        }
    })

    const deleteTermMutation = useMutation(async (termId) => deleteTerm(termId, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("terms")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        for (let i = parseInt(timeFrom); i <= parseInt(timeTo); ++i) {
            addTermMutation.mutateAsync({ date: new Date(date.setHours(i, 0, 0, 0)), user: user, status: 'available' })
        }
    }

    const onChangeDate = (data) => {
        if (data) {
            setDate(new Date(data))
        } else {
            setDate(new Date())
        }
    }

    const handleDelete = ( id ) => {
        deleteTermMutation.mutate( id )
    }

    return (
        <section>
            <h1>Dodawanie terminów</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="date">Data: </label>
                <input
                    id="date"
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => onChangeDate(e.target.value)}
                />
                <br />
                <label htmlFor="user">Instalator: </label>
                <select
                    id="user"
                    value={JSON.stringify(user)}
                    onChange={(e) => setUser(JSON.parse(e.target.value))}
                ><option disabled value={JSON.stringify(null)}> --- Wybierz ---</option>
                    {userData?.map((user) => <option key={user._id} value={JSON.stringify(user)}>{user.username}</option>)}
                </select>
                <br />
                <label>Godziny: </label><br />
                <label htmlFor="timeFrom">Od: </label>
                <select
                    id="timeFrom"
                    value={timeFrom}
                    onChange={(e) => {
                        if (parseInt(e.target.value) > parseInt(timeTo)) {
                            setTimeFrom(e.target.value)
                            setTimeTo(e.target.value)
                        } else setTimeFrom(e.target.value)
                    }}
                >
                    {
                        [...Array(24)].map((x, i) =>
                            <option key={i} value={i}>{`${i}:00`.padStart(5, "0")}</option>
                        )
                    }
                </select>
                <label htmlFor="timeTo">Do: </label>
                <select
                    id="timeTo"
                    value={timeTo}
                    onChange={(e) => {
                        if (parseInt(e.target.value) < parseInt(timeFrom)) {
                            setTimeFrom(e.target.value)
                            setTimeTo(e.target.value)
                        } else setTimeTo(e.target.value)
                    }}
                >
                    {
                        [...Array(24)].map((x, i) =>
                            <option key={i} value={i}>{`${i}:00`.padStart(5, "0")}</option>
                        )
                    }
                </select>
                <button onClick={handleSubmit}>Dodaj</button>
            </form>
            <ul>
                {termData?.map((term) => <li key={term._id}>{[new Date(term.date).toLocaleString(), " ", term.user.username, " ",]}<button onClick={() => handleDelete({ id: term._id })}>Usuń</button></li>)}
            </ul>
        </section>
    )
}

export default TermsList
