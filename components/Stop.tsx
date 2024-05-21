import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { useSpring, animated } from "@react-spring/web";
import { calculateDistance, walkingTime } from "../utils/closestStop";
import { type Stop } from "../utils/db";
import * as Icon from "react-feather";
import type { MonitoredStopVisit } from "../utils/siri";
import { useMediaQuery } from "react-responsive";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  const getClosestStops = (location: { longitude: number, latitude: number } | undefined) => {
    if (!location) return [];

    return data
      .map((stop) => ({
        ...stop,
        distance: calculateDistance(location.latitude, location.longitude, stop.stop_lat, stop.stop_lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  };

  const closestStops = getClosestStops(location);

  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % closestStops.length);
    },
    onSwipedRight: () => {
      setSwipeDirection('right');
      setCurrentIndex((prevIndex) => (prevIndex - 1 + closestStops.length) % closestStops.length);
    },
  });

  const animationProps = useSpring({
    from: { opacity: 0, transform: swipeDirection === 'left' ? 'translateX(100%)' : 'translateX(-100%)' },
    to: { opacity: 1, transform: 'translateX(0%)' },
    reset: true,
  });

  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });

  if (closestStops.length === 0) {
    return <div>Loading...</div>;
  }

  if (isDesktop) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {closestStops.map((stop, index) => (
          <div key={stop.stop_id} style={{ marginRight: '10px' }}>
            <StopFC
              stop_name={stop.stop_name}
              stop_code={stop.stop_code}
              stop_id={stop.stop_id}
              stop_lat={stop.stop_lat}
              stop_lon={stop.stop_lon}
              closest={index === 0}
            />
          </div>
        ))}
      </div>
    );
  }

  const currentStop = closestStops[currentIndex];

  return (
    <div {...handlers}>
      <animated.div style={animationProps}>
        <StopFC
          stop_name={currentStop.stop_name}
          stop_code={currentStop.stop_code}
          stop_id={currentStop.stop_id}
          stop_lat={currentStop.stop_lat}
          stop_lon={currentStop.stop_lon}
          closest={true}
        />
      </animated.div>
    </div>
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
  const [value, setValue] = useState("");

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
      if (data.length !== 0) setArrivals(data);
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
    <button className="flex flex-col p-4 w-80 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:shadow-xl border-2 border-blue-900 transition duration-300">
      <Icon.MapPin className="w-8 h-8 mx-auto mb-2 text-white" />
      <div className="text-white">
        <div className="flex justify-between">
          {/* <h3 className="font-semibold text-lg">
            {closest ? "Closest stop" : ""}
          </h3> */}
          <h3 className="font-semibold text-lg">
            {stop_name} {stop_code}
          </h3>
        </div>
        <div className="justify-between mt-2">
          <h3>
            Distance:{" "}
            <span className="font-semibold">{distance.toFixed(2)} km</span>
          </h3>
          <h3>
            Walk time: <span className="font-semibold">{wt}</span>
          </h3>
        </div>
        <h3 className="mt-2">Upcoming departures:</h3>
        <ul className="text-sm">
          {arrivals.length > 0 ? (
            arrivals.map((arrival, index) => (
              <li key={index}>
                Line {arrival.MonitoredVehicleJourney.PublishedLineName}{" "}
                <span style={{ color: "green" }}>
                  {calculateMinutesUntilArrival(
                    arrival.MonitoredVehicleJourney.MonitoredCall
                      .ExpectedArrivalTime,
                  ) !== 0
                    ? ` in ${calculateMinutesUntilArrival(arrival.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime)} mins`
                    : " now"}
                </span>
              </li>
            ))
          ) : (
            <li>No upcoming departures.</li>
          )}
        </ul>
      </div>
    </button>
  );
};
