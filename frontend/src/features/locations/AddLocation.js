import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {  addLocation } from '../../api/locationsApi'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const AddOrder = () => {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [abbrev, setAbbrev] = useState('')
    const [streetName, setStreetName] = useState('')
    const [buildingNumber, setBuildingNumber] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [cityName, setCityName] = useState('')
    const [locationDesc, setLocationDesc] = useState('')

    const addLocationMutation = useMutation(async (locationDocument) => addLocation(locationDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("locations")
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        addLocationMutation.mutate({ abbrev: abbrev, description: locationDesc, address: { cityName: cityName, zipCode: zipCode, streetName: streetName, buildingNumber: buildingNumber } })
        navigate('/dash/locations')
    }

    return (
        <section>
            <h1>Tworzenie zlecenia</h1>
            <form onSubmit={handleSubmit}>
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

                <br />
                <button>Dodaj</button><button onClick={() => navigate('/dash/locations')}>Wróć</button>
            </form>
        </section>
    )
}

export default AddOrder