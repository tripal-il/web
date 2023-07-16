import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

import type { Stop } from "../api/stops";
import { calculateDistance, walkingTime } from "../utils/closestStop";

type Props = {
  data: Array<Stop>
}

export default function Stops({ data }: Props) {
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
            <b>{(walkingTime(closestDistance)*60).toFixed(0)} minute walk</b>
          </div>
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