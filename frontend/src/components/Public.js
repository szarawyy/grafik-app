import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Public = () => {
    const { auth } = useAuth()
    const content = (
        <section className="public">
            <header>
                <h1><span className="nowrap">Grafik App</span></h1>
            </header>
            <main className="public__main">
                <p>Aplikacja do zarządzania grafikiem</p>
                <br />
                <p>Właściciel: Rafał Uss</p>
            </main>
            <footer>
                <Link to="/login">Zaloguj</Link>
            </footer>
        </section>

    )
    return content
}
export default Public