import { Link } from 'react-router-dom'
import Users from '../../components/Users'
import axiosPrivate from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    

    const content = (
        <div>
            <section className="welcome">

                <p>{today}</p>

                <h1>MENU</h1>

                <p><Link to="/dash/schedule">Pokaż Grafik</Link></p>

                <p><Link to="/dash/terms">Dodaj / usuń terminy</Link></p>

                <p><Link to="/dash/users">Ustawienia użytkowników</Link></p>

                <p><Link to="/dash/locations">Lista lokalizacji</Link></p>

                <p><Link to="/dash/orders">Lista zleceń</Link></p>

            </section>
        </div>
    )

    return content
}
export default Welcome