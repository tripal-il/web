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

  return <div>closest bus stop: {closestStop?.stop_name}<br/>{closestDistance.toFixed(2)} kilometers away</div>
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