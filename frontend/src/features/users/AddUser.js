import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { addUser } from '../../api/usersApi'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const AddUser = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [roles, setRoles] = useState('')

    const addUserMutation = useMutation(async (userDocument) => addUser(userDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("users")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        addUserMutation.mutate({ username: username, password: password, name: { fName: fName, lName: lName }, roles })
        navigate('/dash/users')
    }

    return (
        <section>
            <h1>Dodawanie użytkownika</h1>
            <form onSubmit={handleSubmit} >
                <div className="div-addUser">
                    <label htmlFor="username">Nazwa użytkownika: </label>
                    <input
                        placeholder="Nazwa użytkownika"
                        type="text"
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    /><br />
                    <label htmlFor="password">Hasło: </label>
                    <input
                        placeholder="Hasło"
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    /><br />
                    <label htmlFor="fName">Imię: </label>
                    <input
                        placeholder="Imię"
                        type="text"
                        id="fName"
                        onChange={(e) => setFName(e.target.value)}
                        value={fName}
                    /><br />
                    <label htmlFor="lName">Nazwisko: </label>
                    <input
                        placeholder="Nazwisko"
                        type="text"
                        id="lName"
                        onChange={(e) => setLName(e.target.value)}
                        value={lName}
                    />
                    <br />
                    <fieldset>
                        <legend>Typ użytkownika:</legend>
                        <div onChange={(e) => setRoles([e.target.value])}>
                            <input type="radio" id="fitter" name="roles" value="fitter" />
                            <label htmlFor="fitter">Instalator</label>

                            <input type="radio" id="viewer" name="roles" value="viewer" />
                            <label htmlFor="viewer">Przeglądający</label>

                            <input type="radio" id="editor" name="roles" value="editor" />
                            <label htmlFor="editor">Edytujący</label>
                        </div>
                    </fieldset>
                </div>
                <button>Dodaj</button><button onClick={() => navigate('/dash/users')}>Wróć</button>
            </form>

        </section >
    )
}

export default AddUser