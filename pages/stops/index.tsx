import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

import type { Stop } from "../api/stops";
import { calculateDistance } from "../utils/closestStop";

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
    <div>
      <div className="m-10">
        <h1 className="text-3xl font-bold text-gray-900">Search for stops</h1>
        <br />
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="text-sm mb-2">Closest stop</div>
            <div className="font-bold text-xl mb-2">{closestStop?.stop_name}</div>
            <div className="text-base">
              <b>{closestDistance.toFixed(2)}km</b> away from you
            </div>
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