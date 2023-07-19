import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

import type { Stop } from "../api/stops";
import { calculateDistance, walkingTime } from "../utils/closestStop";

type Props = {
  data: Array<Stop>
}

type FoundStop = {
  stop_name: string
  stop_id: string
  stop_lat: number
  stop_lon: number
  distance: any
  walkingTime: string
}

export default function Stops({ data }: Props) {
  const [value, setValue] = useState<string>();
  const [visible, setVisible] = useState<boolean>();
  const [foundStops, setFoundStops] = useState<Array<FoundStop>>();
  const [location, setLocation] = useState<{ latitude: number, longitude: number }>();

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

  const findStops = (qu: string) => {
    let arr: Array<FoundStop> = [];
    for (const stop of data) {
      if (stop.stop_name.includes(qu)) {
        let cstop;
        let cdistance = Infinity;
        const distance = calculateDistance(
          location?.latitude,
          location?.longitude,
          stop.stop_lat,
          stop.stop_lon
        );

        if (distance < closestDistance) {
          cstop = stop;
          cdistance = distance
        }

        let wtime = walkingTime(distance);

        arr.push({stop_name: stop.stop_name, stop_lat: stop.stop_lat, stop_lon: stop.stop_lon, stop_id: stop.stop_id, distance, walkingTime: wtime});
      }
    }

    setFoundStops(arr);
    setVisible(true);
  }

  const FoundStops: React.FC<{ stops: Array<FoundStop> }> = ({ stops }) => {
    if (stops) {
      return stops.map((stop) => {
        return (
          <div>
            <div className="card" style={{ width: '255px' }}>
              <div className="card-content">
                <div className="media-content">
                  <div className="title is-4">{stop.stop_name}</div>
                  <div className="content">
                    <b>{stop.distance.toFixed(2)}km</b> away from you
                    <br />
                    <b>{stop.walkingTime}</b>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </div>
        )
      })
    }
  }

  return (
    <div style={{ margin: '45px' }}>
      <h1 className="title">Search for stops</h1>
      <div className="card" style={{ width: '255px' }}>
        <div className="card-content">
          <div className="media-content">
            <div className="title is-4">{closestStop?.stop_name}</div>
            <div className="subtitle is-6">Closest stop</div>
          </div>
          <div className="content">
            <b>{closestDistance.toFixed(2)}km</b> away from you
            <br />
            <b>{walkingTime(closestDistance)}</b>
          </div>
        </div>
      </div>
      <br />
      <div>
        <input className="input" placeholder="search for stops" onChange={(e) => setValue(e.target.value)} />
        <button className="button is-primary" onClick={() => findStops(value as string)}>search</button>
        <br />
        <hr />
        <br />

        <div style={{ display: visible ? 'block' : 'none' }}>
          <FoundStops stops={foundStops as Array<FoundStop>}></FoundStops>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const req = await fetch('http://localhost:3000/api/stops');
  const stops = await req.json() as Array<Stop>;

  return {
    props: {
      data: stops,
    }
  }
}