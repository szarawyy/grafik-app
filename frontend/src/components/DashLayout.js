import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import useAuth from '../hooks/useAuth'

const DashLayout = () => {
    const { auth } = useAuth()
    return (
        <>
            <DashHeader roles={auth.roles}/>
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter username={auth.user} roles={auth.roles}/>
        </>
    )
}
export default DashLayout