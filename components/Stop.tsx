import { useState, useEffect } from "react";
import { calculateDistance, walkingTime } from "../pages/utils/closestStop";
import { type Stop } from "../pages/utils/db";
import * as Icon from "react-feather";
import type { MonitoredStopVisit } from "../pages/utils/siri";

interface StopData {
  stop_name: string;
  stop_id?: string;
  stop_code: string;
  stop_lat: number;
  stop_lon: number;
  closest?: boolean;
}

export const ClosestStop: React.FC<{ data: Array<Stop> }> = ({ data }) => {
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();

  useEffect(() => {
    if ("geolocation" in navigator) {
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
      stop.stop_lon,
    );

    if (distance < closestDistance) {
      closestStop = stop;
      closestDistance = distance;
    }
  }

  return (
    <StopFC
      stop_name={closestStop?.stop_name as string}
      stop_code={closestStop?.stop_code as string}
      stop_id={closestStop?.stop_id as string}
      stop_lat={closestStop?.stop_lat as number}
      stop_lon={closestStop?.stop_lon as number}
      closest={true}
    />
  );
};

export const StopFC: React.FC<StopData> = ({
  stop_name,
  stop_code,
  stop_lat,
  stop_lon,
  closest,
}: StopData) => {
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [arrivals, setArrivals] = useState<MonitoredStopVisit[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateMinutesUntilArrival = (arrivalTime: string) => {
    const now = new Date();
    const busArrivalTime = new Date(arrivalTime);
    const differenceInMilliseconds = busArrivalTime.getTime() - now.getTime();
    return Math.round(differenceInMilliseconds / 1000 / 60);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/stop_schedule/${stop_code}`,
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length != 0) setArrivals(data);
      else setLoading(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
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
    stop_lon,
  );
  const wt = walkingTime(Number(distance));
  // if (error) {
  //   console.log(arrivals);
  //   return <div>Error: {error}</div>;
  // }

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <button className="flex p-4 w-64 h-18 bg-[#2b333d] rounded-md shadow-md border-2 border-white hover:border-[#0388fc] duration-300 transition-all">
      <Icon.MapPin className="mt-6 w-8 h-8 pr-2" />
      <div className="flex flex-col">
        <h3 className="monserrat text-[#B0CFFF] text-left font-bold text-lg">
          {stop_name} {stop_code}
          <span className="dmsans pl-2 text-sm text-white font-regular">
            {closest ? "closest stop" : ""}
          </span>
        </h3>
        <h3 className="flex monserrat text-white text-right text-md">
          Distance:
          <span className="pl-2 monserrat text-white text-left font-bold text-md">
            {distance.toFixed(2)}km
          </span>
        </h3>
        <h3 className="flex monserrat text-white text-right text-md">
          Walk time:
          <span className="pl-2 monserrat text-white text-left font-bold text-md">
            {wt}
          </span>
        </h3>
        <h3 className="flex monserrat text-white text-right text-md">
          Upcoming departures:
        </h3>
        <ul>
          {arrivals.map((arrival, index) => (
            <li key={index}>
              Line {arrival.MonitoredVehicleJourney.PublishedLineName}
              <span style={{ color: "green" }}>
                {calculateMinutesUntilArrival(
                  arrival.MonitoredVehicleJourney.MonitoredCall
                    .ExpectedArrivalTime,
                ) !== 0
                  ? ` in ${calculateMinutesUntilArrival(arrival.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime)}`
                  : " now"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
};
