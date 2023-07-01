import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

import type { Route } from "../api/routes";
import { Agency } from "../api/agencies";

type Props = {
  data: { stops: Array<Route>, agencies: Array<Agency> }
}

export default function Stops({ data }: Props) {
  return data.stops.map((route) => {
    let agencies = data.agencies;
    let agency = agencies.find((agency) => agency.agency_id === route.agency_id);
    return (
      <div>{route.route_short_name ? route.route_short_name : route.route_long_name} | {agency?.agency_name}</div>
    )
  });
}

export const getServerSideProps: GetServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const stops_req = await fetch('http://localhost:3000/api/routes');
  const stops = await stops_req.json() as Array<Route>;

  const agencies_req = await fetch('http://localhost:3000/api/agencies');
  const agencies = await agencies_req.json() as Array<Agency>;

  return {
    props: {
      data: { stops, agencies },
    }
  }
}