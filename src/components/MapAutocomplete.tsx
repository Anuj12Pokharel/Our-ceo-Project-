import { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBzplldWkrkkixwOxLtz6jkKdFCxYfgEdo";

const libraries: ("places")[] = ["places"];

type MapAutocompleteProps = {
    onPlaceSelect?: (address: string) => void;
};

export const MapAutocomplete = ({ onPlaceSelect }: MapAutocompleteProps) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [address, setAddress] = useState("");
    const [mapUrl, setMapUrl] = useState("");

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
            const selectedAddress = place.formatted_address;
            setAddress(selectedAddress);
            setMapUrl(
                `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                    selectedAddress
                )}`
            );
            onPlaceSelect?.(selectedAddress);
        }
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
            <div className="space-y-4">
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                        type="text"
                        placeholder="Enter location"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Autocomplete>

                {mapUrl && (
                    <iframe
                        title="Selected Location"
                        width="100%"
                        height="300"
                        frameBorder="0"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapUrl}
                    />
                )}
            </div>
        </LoadScript>
    );
};

export default MapAutocomplete;
