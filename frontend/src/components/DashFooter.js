import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faSignOut } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useLogout from '../hooks/useLogout'

const DashFooter = (props) => {

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const logout = useLogout()

    const signOut = async () => {
        await logout()
        navigate('/')
    }

    const onGoHomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if (pathname !== '/dash') {
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="dash-footer">
            {goHomeButton}
            <p>Current User: {props.username}</p>
            <button
                className="dash-footer__button icon-button"
                onClick={signOut}>
                <FontAwesomeIcon icon={faSignOut} />
            </button>
        </footer>
    )
    return content
}
export default DashFooter