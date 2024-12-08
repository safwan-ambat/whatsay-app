import { useEffect, useState } from "react"
import * as Location from "expo-location";

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [latitude, setLatitude] = useState<any>("");
    const [longitude, setLongitude] = useState<any>("");
    const [location, setLocation] = useState<any>("")

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            setErrorMsg("Permission to location was not granted");
            return;
        }

        let { coords } = await Location.getCurrentPositionAsync();

        if (coords) {
            const { latitude, longitude } = coords;
            console.log("lat and long is", latitude, longitude);
            setLatitude(latitude);
            setLongitude(longitude);
            let response = await Location.reverseGeocodeAsync({
                latitude, longitude
            });

            console.log("USER LOCATION IS: ", response);
            setLocation(response)
        }
    }

    useEffect(() => {
        getUserLocation()
    }, []);

    return { latitude, longitude, errorMsg,location };
}

export default useLocation;