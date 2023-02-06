import { useRef, useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"

import axios from '../../api/axios'
const LOGIN_URL = '/auth'

const Login = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      const accessToken = response?.data?.accessToken
      const roles = jwt_decode(accessToken).UserInfo.roles

      setAuth({ user, roles, accessToken })
      setUser('')
      setPwd('')
      navigate('/dash/schedule', { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err?.response?.status === 400) {
        setErrMsg('Missing username or password')
      } else if (err?.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus()
    }
  }

  return (
    <section className="dash-container">
      <p ref={errRef}>{errMsg}</p>
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Login: </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        /><br />
        <label htmlFor="password">Hasło: </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        /><br />
        <button>Zaloguj</button>
      </form>
    </section>
  )
}

export default Login