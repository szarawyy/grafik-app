import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getUsers, addUser, deleteUser } from '../../api/usersApi'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'


const UsersList = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const { data, isLoading, isError } = useQuery(["users"], () => getUsers(null, axiosPrivate))

    const deleteUserMutation = useMutation(async (userId) => deleteUser(userId, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("users")
        }
    })

    if (isLoading) {
        return <h1>LOADING...</h1>
    }

    if (isError) {
        return (
            <div>
                <h1>Error</h1>
                <p><Link to="/login">Logowanie</Link></p>
            </div>
        )
    }

    const handleDelete = (id) => {
        deleteUserMutation.mutate(id)
    }

    return (
        <div>
            <h1>Lista użytkowników</h1>
            <table>
                <thead>
                    <tr>
                        <th>Użytkownik</th><th>Imię i nazwisko</th><th>Rola</th><th>
                            <button onClick={() => navigate('/dash/users/add')} className="dash-footer__button icon-button"><FontAwesomeIcon icon={faPlus} /></button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, i) => <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{[user?.name?.fName, ' ', user?.name?.lName]}</td>
                        <td><ul>{user.roles.map((role) => <li>{role}</li>)}</ul></td>
                        <td><button onClick={() => handleDelete({ id: user._id })} className="dash-footer__button icon-button">
                            <FontAwesomeIcon icon={faTrash} />
                        </button></td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default UsersList
