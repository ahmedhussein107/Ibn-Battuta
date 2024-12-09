const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY;

export default async function reverseGeocode(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }

        const data = await response.json();
        if (data.status === "OK") {
            const results = data.results[0];
            let governorate = "";
            let country = "";

            const addressComponents = results.address_components;
            addressComponents.forEach((component) => {
                if (component.types.includes("administrative_area_level_1")) {
                    // Governorate or State
                    governorate = component.long_name;
                    let governorateSplit = governorate.split(" ");
                    governorate = governorateSplit[0];
                }
                if (component.types.includes("country")) {
                    country = component.long_name;
                }
            });

            return `${governorate}, ${country}`;
        } else {
            throw new Error(data.error_message || "No location found");
        }
    } catch (error) {
        console.error("Error:", error.message);
        return "Error fetching location";
    }
}
