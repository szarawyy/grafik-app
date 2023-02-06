import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addOrder } from '../../api/ordersApi'
import { useState } from 'react'
import { getLocations, addLocation } from '../../api/locationsApi'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'

const AddOrder = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { auth } = useAuth()
    const [location, setLocation] = useState(null)
    const [ifAddNewLocation, setIfAddNewLocation] = useState(false)
    const [abbrev, setAbbrev] = useState('')
    const [streetName, setStreetName] = useState('')
    const [buildingNumber, setBuildingNumber] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [cityName, setCityName] = useState('')
    const [locationDesc, setLocationDesc] = useState('')
    const [desc, setDesc] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')

    const { data: locationData } = useQuery(["locations"], () => getLocations(null, axiosPrivate))

    const addLocationMutation = useMutation(async (locationDocument) => addLocation(locationDocument, axiosPrivate), {
        onSuccess: (response) => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("locations")
            addOrderMutation.mutate({ modifiedBy: auth.user, description: desc, location: response.data.object, apartmentNumber: apartmentNumber })
        }
    })

    const addOrderMutation = useMutation(async (orderDocument) => addOrder(orderDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("orders")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (ifAddNewLocation) {
            addLocationMutation.mutate({ abbrev: abbrev, description: locationDesc, address: { cityName: cityName, zipCode: zipCode, streetName: streetName, buildingNumber: buildingNumber } })
        } else {
            addOrderMutation.mutate({ modifiedBy: auth.user, description: desc, location: location, apartmentNumber: apartmentNumber })
        }
        navigate('/dash/schedule')
    }

    return (
        <section>
            <h1>Tworzenie zlecenia</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="location">Lokalizacja: </label>
                {!ifAddNewLocation && (<select
                    id="location"
                    name="location"
                    value={JSON.stringify(location)}
                    onChange={(e) => setLocation(JSON.parse(e.target.value))}
                ><option disabled value={JSON.stringify(null)}> --- Wybierz ---</option>
                    {locationData?.map((locationElement) => <option key={locationElement._id} value={JSON.stringify(locationElement)}>{locationElement.abbrev}</option>)}
                </select>)}
                <label htmlFor="newLocation">Dodaj nową</label>
                <input
                    type="checkbox"
                    id="newLocation"
                    name="newLocation"
                    checked={ifAddNewLocation}
                    onChange={() => setIfAddNewLocation(!ifAddNewLocation)}
                />
                <br />
                {ifAddNewLocation && (<div>
                    <label htmlFor="abbrev">Skrót: </label>
                    <input
                        placeholder="Skrót"
                        type="text"
                        id="abbrev"
                        onChange={(e) => setAbbrev(e.target.value)}
                        value={abbrev}
                    />
                    <label htmlFor="streetName">Ulica: </label>
                    <input
                        placeholder="Ulica"
                        type="text"
                        id="streetName"
                        onChange={(e) => setStreetName(e.target.value)}
                        value={streetName}
                    />
                    <label htmlFor="buildingNumber">Numer budynku: </label>
                    <input
                        placeholder="Ulica"
                        type="text"
                        id="buildingNumber"
                        onChange={(e) => setBuildingNumber(e.target.value)}
                        value={buildingNumber}
                    /><br />
                    <label htmlFor="zipCode">Kod pocztowy: </label>
                    <input
                        placeholder="Kod pocztowy"
                        type="text"
                        id="zipCode"
                        onChange={(e) => setZipCode(e.target.value)}
                        value={zipCode}
                    />
                    <label htmlFor="cityName">Miejscowość: </label>
                    <input
                        placeholder="Miejscowość"
                        type="text"
                        id="cityName"
                        onChange={(e) => setCityName(e.target.value)}
                        value={cityName}
                    /><br />
                    <label htmlFor="locationDesc">Opis lokalizacji: </label>
                    <textarea
                        placeholder="Opis lokalizacji..."
                        id="locationDesc"
                        onChange={(e) => setLocationDesc(e.target.value)}
                        value={locationDesc}
                    />
                </div>)}

                <br />

                <label htmlFor="apartmentNumber">Numer lokalu: </label>
                <input
                    placeholder="Numer lokalu"
                    type="text"
                    id="apartmentNumber"
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    value={apartmentNumber}
                />
                <p>Adres: {ifAddNewLocation ?
                    [streetName, " ", buildingNumber, apartmentNumber ? ['/', apartmentNumber] : '']
                    : [location?.address.streetName, " ", location?.address.buildingNumber, apartmentNumber ? ['/', apartmentNumber] : '']}</p>

                <textarea
                    placeholder="Opis zlecenia..."
                    id="desc"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                /><br />
                <button>Dodaj</button>
            </form>
        </section>
    )
}

export default AddOrder