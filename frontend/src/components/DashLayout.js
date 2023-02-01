import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import useAuth from '../hooks/useAuth'

const DashLayout = () => {
    const { auth } = useAuth()
    return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter username={auth.user}/>
        </>
    )
}
export default DashLayout