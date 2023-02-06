import { Link } from 'react-router-dom'

const DashHeader = (props) => {

    let headerTitle = null
    if (props.roles?.includes('admin') || props.roles?.includes('editor')) {
        headerTitle = (
            <Link to="/dash">
                <h1 className="dash-header__title">Grafik</h1>
            </Link>
        )
    } else {
        headerTitle = (
            <h1 className="dash-header__title">Grafik</h1>
        )
    }

    const content = (
        <header className="dash-header">
            <div className="dash-header__container">
                {headerTitle}
                <nav className="dash-header__nav">
                </nav>
            </div>
        </header>
    )

    return content
}
export default DashHeader