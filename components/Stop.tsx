import { useState, useEffect } from "react";
import { calculateDistance, walkingTime } from "../pages/utils/closestStop";
import { Stop } from "../pages/utils/db";
import * as Icon from 'react-feather';

interface StopData {
    stop_name: string;
    stop_id: string;
    stop_lat: number;
    stop_lon: number;
    closest: boolean;
}



export const ClosestStop: React.FC<{ data: Array<Stop> }> = ({ data }) => {
  const [location, setLocation] = useState<{ longitude: number, latitude: number }>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  let closestStop;
  let closestDistance = Infinity;

  for (const stop of data) {
    const distance = calculateDistance(
      location?.latitude,
      location?.longitude,
      stop.stop_lat,
      stop.stop_lon
    );

    if (distance < closestDistance) {
      closestStop = stop;
      closestDistance = distance;
    }
  }
  
  return <StopFC stop_name={closestStop?.stop_name as string} stop_id={closestStop?.stop_id as string} stop_lat={closestStop?.stop_lat as number} stop_lon={closestStop?.stop_lon as number} closest={true}/>
}


export const StopFC: React.FC<StopData> = ({stop_name, stop_id, stop_lat, stop_lon, closest }: StopData) => {
  const [location, setLocation] = useState<{ longitude: number, latitude: number }>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);
    const distance = calculateDistance(
       location?.latitude,
       location?.longitude,
       stop_lat,
       stop_lon
     );
    const wt = walkingTime(Number(distance));
    return ( 
        <button className="flex p-4 w-64 h-18 bg-[#2b333d] rounded-md shadow-md border-2 border-white hover:border-[#0388fc] duration-300 transition-all">
            <Icon.MapPin className='mt-6 w-8 h-8 pr-2'/>
          <div className='flex flex-col'>
          <h3 className="monserrat text-[#B0CFFF] text-left font-bold text-lg">{stop_name}<span className="dmsans pl-2 text-sm text-white font-regular">{closest ? "closest stop" : ""}</span></h3>
            <h3 className="flex monserrat text-white text-right text-md">Distance:<span className="pl-2 monserrat text-white text-left font-bold text-md">{distance.toFixed(2)}km</span></h3> 
            <h3 className="flex monserrat text-white text-right text-md">Walk time:<span className="pl-2 monserrat text-white text-left font-bold text-md">{wt}</span></h3> 
        </div>
      </button>
    )
}