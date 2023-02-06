import { Link } from 'react-router-dom'

const Unauthorized = () => {
    return (
        <div>
            <h1>Brak dostępu</h1>
            <p><Link to="/dash/schedule">Wróć do strony głównej</Link></p>
        </div>
    )
}

export default Unauthorized