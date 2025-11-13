import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import MapAutocomplete from '../MapAutocomplete';

function Addresses() {
    const [selectedLocation, setSelectedLocation] = useState("");
    
    return (
        <Card className="shadow-card">
            <CardHeader>
                <CardTitle>Addresses</CardTitle>
                <CardDescription>Address Information of a client</CardDescription>
            </CardHeader>
            <CardContent>
                <MapAutocomplete onPlaceSelect={(location) => setSelectedLocation(location)} />
            </CardContent>
        </Card>
    )
}

export default Addresses