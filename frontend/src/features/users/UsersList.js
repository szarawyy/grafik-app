import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUsers, addUser, deleteUser } from '../../api/usersApi'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Link } from 'react-router-dom'


const UsersList = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()

    const [newUser, setNewUser] = useState('')


    const { data, isLoading, isError, error } = useQuery(["users"], () => getUsers(null, axiosPrivate))

    const addUserMutation = useMutation(async (userDocument) => addUser(userDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidates cache and refetch 
            queryClient.invalidateQueries("users")
        }
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()
        addUserMutation.mutate({ username: newUser, password: "123456", roles: ['employee'] })
        setNewUser('')
    }

    const handleDelete = ( id ) => {
        deleteUserMutation.mutate( id )
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter a new user</label>
                <div>
                    <input
                        type="text"
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        placeholder="Enter new user"
                    />
                </div>
                <button>ADD</button>
            </form>

            <h1>Users List</h1>
            <ul>
                {data.map((user, i) => <li key={i}>{i + 1}. {user.username}<button onClick={() => handleDelete({ id: user._id })/* () => deleteUserMutation.mutate({ id: user._id }) */}>DELETE</button></li>)}
            </ul>
        </div>
    )
}

export default UsersList
