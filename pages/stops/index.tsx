import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

type Stop = {
  stop_id: string
  stop_code: string
  stop_name: string
  tts_stop_name: string | null
  stop_desc: string
  stop_lat: number
  stop_lon: number
  zone_id: string
  stop_url: string | null
  location_type: number
  parent_station: string | null
  stop_timezone: string | null
  wheelchair_boarding: string | null
  level_id: string | null
  platform_code: string | number | null
}

type Props = {
  data: Array<Stop>
}

export default function Stops({ data }: Props) {
  return data.map((stop) => {
    return (
      <div>{stop.stop_name}</div>
    )
  });
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