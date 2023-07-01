import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

import type { Stop } from "../api/stops";

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