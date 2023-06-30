import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Map, Marker, MapkitProvider } from "react-mapkit";
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
  data: Stop
}

export default function StopByCode({ data }: Props) {
  return (
    <div style={{ textAlign: 'right' }}>
      <h1>{data.stop_name} (<small><i>{data.stop_code}</i></small>)</h1>
      <Map tokenOrCallback="maps.com.tripal.tripal">
        <Marker latitude={data.stop_lat} longitude={data.stop_lon} />
      </Map>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const code = (ctx.params as { code: string }).code as string;
  const req = await fetch(`http://localhost:3000/api/stops/${code}`);
  const stop = await req.json() as Stop;

  return {
    props: {
      data: stop,
    }
  }
}