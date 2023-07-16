import type { GetServerSideProps } from "next"
import type { Route } from "../api/routes"
import fetch from "node-fetch"
import { Trip } from "../api/trips"
import { StopTime } from "../api/stop_times/trip/[trip_id]"
import { Stop } from "../api/stops"
import { Agency } from "../api/agencies"
import { useEffect, useState } from "react"
import { calculateDistance, walkingTime } from "../utils/closestStop"

type Props = {
  trip_info: TripInformation
  agency_name: string
  route_short_name: string
  route_long_name: string
}

type TripInformation = Array<{ stop_id: string, stop_name: string, stop_sequence: number, stop_lon: number, stop_lat: number }>;

const BusTimes: React.FC<{ data: TripInformation, reversed: boolean, lon: number, lat: number }> = ({ data, reversed, lat, lon }) => {
  // let closestStop: { stop_id: string, stop_name: string, stop_lon: number, stop_lat: number };
  let closestStop: { stop_id: string, stop_name: string, stop_lon: number, stop_lat: number } = { stop_id: '', stop_name: '', stop_lon: 0, stop_lat: 0 };
  let closestDistance = Infinity;
  for (const stop of data) {
    const distance = calculateDistance(
      lat,
      lon,
      stop.stop_lat,
      stop.stop_lon
    );
  
    if (distance < closestDistance) {
      closestStop = stop;
      closestDistance = distance;
    }
  }
  

  if (reversed) {
    data = data.reverse();
    return data.map((stop) => {
      if (stop.stop_name === (closestStop as { stop_id: string, stop_name: string, stop_lon: number, stop_lat: number }).stop_name) {
        return (
          <div>
            <h4 className="title is-5">{stop.stop_name} ({closestDistance.toFixed(2)}km away, {walkingTime(closestDistance)}</h4>
          </div>
        )
      } else {
        return (
          <div>
            <h4>{stop.stop_name}</h4>
            <br />
          </div>
        )
      }
    });
  } else {
    return data.map((stop) => {
      if (stop.stop_name === (closestStop as { stop_id: string, stop_name: string, stop_lon: number, stop_lat: number }).stop_name) {
        return (
          <div>
            <h4 className="title is-5">{stop.stop_name} ({closestDistance.toFixed(2)}km away, {walkingTime(closestDistance)})</h4>
          </div>
        )
      } else {
        return (
          <div>
            <h4>{stop.stop_name}</h4>
            <br />
          </div>
        )
      }
    });
  }
}

export default function Trip({ trip_info, agency_name, route_short_name, route_long_name }: Props) {
  const [location, setLocation] = useState<{ latitude: number, longitude: number }>();
  const [isReversed, setIsReversed] = useState<boolean>();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
    setIsReversed(false);
  }, []);

  return (
    <div style={{ margin: '45px' }}>
      <div className="card">
        <div className="card-content">
          <div className="title is-4">{route_short_name}</div>
          <div className="subtitle is-5">{agency_name}</div>
          <br />
          <div className="media-content">
            <button style={{ float: 'right' }} className="button is-info" onClick={() => setIsReversed(isReversed ? false : true)}>change direction</button>
            <br />
            <BusTimes data={trip_info} reversed={isReversed as boolean} lon={location?.longitude as number} lat={location?.latitude as number} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const route_id = (ctx.params as { route_id: string })['route_id'];
  const route_req = await fetch('http://localhost:3000/api/routes');
  const route_res = await route_req.json() as Array<Route>;
  const route = route_res.find((route) => route.route_id === route_id);
  const route_long_name = route?.route_long_name;
  const route_short_name = route?.route_short_name;

  const agencies_req = await fetch('http://localhost:3000/api/agencies');
  const agencies_res = await agencies_req.json() as Array<Agency>;
  const agency = agencies_res.find((agency) => agency.agency_id === route?.agency_id) as Agency;
  const agency_name = agency.agency_name;

  const trips_req = await fetch('http://localhost:3000/api/trips');
  const trips_res = await trips_req.json() as Array<Trip>;
  const trip = trips_res.find((trip) => trip.route_id === route_id);
  const trip_id = trip?.trip_id;

  const stops_req = await fetch('http://localhost:3000/api/stops');
  const stops_res = await stops_req.json() as Array<Stop>;

  const stop_times_req = await fetch(`http://localhost:3000/api/stop_times/trip/${trip_id}`);
  const stop_times_res = await stop_times_req.json() as Array<StopTime>;

  let data: TripInformation = [];

  for (const stop of stop_times_res) {
    const foundStop = stops_res.find((foundStop) => foundStop.stop_id === stop.stop_id) as Stop;
    data.push({ stop_id: stop.stop_id, stop_name: foundStop.stop_name, stop_sequence: stop.stop_sequence, stop_lon: foundStop.stop_lon, stop_lat: foundStop.stop_lat });
  }

  return {
    props: {
      agency_name,
      route_short_name,
      route_long_name,
      trip_info: data
    }
  }
}