import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";

import { ClosestStop, StopFC } from "../../components/Stop";
import type { Stop } from "../utils/db";
import { calculateDistance, walkingTime } from "../utils/closestStop";
import { stops } from "../utils/db";
import Head from "next/head";

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

  let closestStop: Stop;
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
        return <StopFC stop_name={stop.stop_name} stop_id={stop.stop_id} stop_lat={stop.stop_lat} stop_lon={stop.stop_lon} closest={(closestStop as Stop).stop_name === stop.stop_name ? true : false} />
      })
    }
  }

  return (
    <div style={{ margin: '45px' }}>
      <Head>
        <link rel="icon" href="images/icon.png" />
      </Head>
      <h1 className="title">Search for stops</h1>
      <ClosestStop data={data} />
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
  const stps = await stops();

  return {
    props: {
      data: stps,
    }
  }
}