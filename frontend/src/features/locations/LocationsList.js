import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { getLocations, addLocation, deleteLocation } from '../../api/locationsApi'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const LocationsList = () => {
    const queryClient = useQueryClient()
    const [newAbbrev, setNewAbbrev] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newStreetName, setNewStreetName] = useState('')
    const [newBuildingNumber, setNewBuildingNumber] = useState('')
    const [newCityName, setNewCityName] = useState('')
    const [newZipCode, setNewZipCode] = useState('')
    const axiosPrivate = useAxiosPrivate()

    const { data: locationData, isError: isLocationError } = useQuery(["locations"], () => getLocations(axiosPrivate))

    const addLocationMutation = useMutation(async (locationDocument) => addLocation(locationDocument, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("locations")
        }
    })

    const deleteLocationMutation = useMutation(async (locationId) => deleteLocation(locationId, axiosPrivate), {
        onSuccess: () => {
            // Invalidate cache and refetch 
            queryClient.invalidateQueries("locations")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        addLocationMutation.mutate({ abbrev: newAbbrev, description: newDesc, address: { cityName: newCityName, zipCode: newZipCode, streetName: newStreetName, buildingNumber: newBuildingNumber } })
        /* const alphabeth = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        for (let i = 0; i<10; i++) {
            let abbrstring = alphabeth[Math.floor(Math.random() * 26)] + alphabeth[Math.floor(Math.random() * 26)] + '/' + (Math.floor(Math.random() * 200)).toString()
            addLocationMutation.mutate(
                { abbrev: abbrstring, description: 'test', address: { cityName: 'Warszawa', zipCode: '00-000', streetName: 'test', buildingNumber: (Math.floor(Math.random() * 200)).toString() } }
            )
        } */
        setNewAbbrev('')
        setNewDesc('')
        setNewStreetName('')
        setNewBuildingNumber('')
        setNewCityName('')
        setNewZipCode('')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter a new location</label>
                <div>
                    <input
                        type="text"
                        value={newAbbrev}
                        onChange={(e) => setNewAbbrev(e.target.value)}
                        placeholder="Enter abbrev"
                    />
                    <input
                        type="text"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Enter desc"
                    />
                    <input
                        type="text"
                        value={newStreetName}
                        onChange={(e) => setNewStreetName(e.target.value)}
                        placeholder="Enter StreetName"
                    />
                    <input
                        type="text"
                        value={newZipCode}
                        onChange={(e) => setNewZipCode(e.target.value)}
                        placeholder="Enter ZipCode"
                    />
                    <input
                        type="text"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        placeholder="Enter CityName"
                    />
                    <input
                        type="text"
                        value={newBuildingNumber}
                        onChange={(e) => setNewBuildingNumber(e.target.value)}
                        placeholder="Enter BuildingNumber"
                    />
                </div>
                <button>ADD</button>
            </form>



            {isLocationError && <p>Not found</p>}
            {!isLocationError &&
                <ul>
                    {locationData?.map((location, i) => <li key={location._id}>{[location.abbrev, " ", location.address.streetName, " ", location.address.buildingNumber]}
                        <button onClick={() => deleteLocationMutation.mutate({ id: location._id })}>DELETE</button></li>)}
                </ul>
            }
        </div>
    )
}

export default LocationsList
