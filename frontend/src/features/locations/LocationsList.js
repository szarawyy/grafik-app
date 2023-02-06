import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { getLocations, deleteLocation } from '../../api/locationsApi'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const LocationsList = () => {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()

    const { data: locationData, isError: isLocationError } = useQuery(["locations"], () => getLocations(null, axiosPrivate))

    const deleteLocationMutation = useMutation(async (locationId) => deleteLocation(locationId, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("locations")
        }
    })

    return (
        <div>
            {isLocationError && <p>Not found</p>}
            {!isLocationError &&
                <div>
                    <h1>Lista lokalizacji</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Lokalizacja</th><th>Adres</th><th>
                                    <button onClick={() => navigate('/dash/locations/add')} className="dash-footer__button icon-button"><FontAwesomeIcon icon={faPlus} /></button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationData?.map((location, i) => <tr key={location._id}>
                                <td><Link to={`/dash/locations/${location._id}`}>{location.abbrev}</Link></td>
                                <td>{[location.address.streetName, ' ', location.address.buildingNumber, ', ', location.address.zipCode, ' ', location.address.cityName]}</td>
                                <td><button onClick={() => deleteLocationMutation.mutate({ id: location._id })} className="dash-footer__button icon-button">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default LocationsList