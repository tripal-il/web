import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";

import type { Route } from "../api/routes";
import { Agency } from "../api/agencies";

type Props = {
  data: { routes: Array<Route>, agencies: Array<Agency> }
}

export default function Stops({ data }: Props) {
  // return data.stops.map((route) => {
  //   let agencies = data.agencies;
  //   let agency = agencies.find((agency) => agency.agency_id === route.agency_id);
  //   let type = ('Train' ? route.agency_id === "2" : 'Bus') ? '🚆' : '🚍';
  //   return (
      
  //   )
  // });
  const [route, setRoute] = useState<string>();
  const [info, setInfo] = useState<{ name: string, agency: string, type: '🚆' | '🚍' }>();
  const [visible, setVisible] = useState<boolean>();
  const [decoratedAgencies, setDecoratedAgencies] = useState<Array<{ agency: string, routes: Array<Route> }>>()

  let agencies: Array<Agency> = data.agencies;
  let routes: Array<Route> = data.routes;

  useEffect(() => {
    let arr: Array<{ agency: string, routes: Array<Route> }> = [];
    for (const agency of agencies) {
      const found = routes.filter((route) => route.agency_id === agency.agency_id);
      arr.push({ agency: agency.agency_name, routes: found });
    }

    setDecoratedAgencies(arr);
    setVisible(false);
  }, []);

  console.log(decoratedAgencies);

  const findRoute = (short_name: string) => {
    const route = routes.find((route) => route.route_short_name === short_name) as Route;
    const agency = agencies.find((agency) => agency.agency_id === route?.agency_id) as Agency;
    const type = ('Train' ? route.agency_id === "2" : 'Bus') ? '🚆' : '🚍';

    setInfo({ name: route.route_short_name, agency: agency.agency_name, type });
    setVisible(true);
  }

  const Routes: React.FC<{ routes: Array<Route> }> = ({ routes }) => {
    return routes.map((route) => {
      return (
        <div className="text-base">{route.route_short_name ? route.route_short_name : route.route_long_name}</div>
      )
    });
  }

  const AgenciesAndRoutes: React.FC = () => {
    return decoratedAgencies?.map((agency) => {
      const routes = agency.routes;
      return (
        <div>
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{agency.agency}</div>
              <Routes routes={routes} />
            </div>
          </div>
          <br />
        </div>
      )
    });
  }


  return (
    <div className="m-10">
      <h1 className="text-3xl font-bold text-gray-900">Search for routes</h1>
      <br />
      <input className="rounded border-gray-500" onChange={(e) => setRoute(e.target.value)} />
      <button onClick={() => findRoute(route as string)}>submit</button>
      <br />
      <br />
      <div className="max-w-sm rounded overflow-hidden shadow-lg" style={{ display: visible ? 'block' : 'none' }}>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{info?.type} {info?.name} ({info?.agency})</div>
        </div>
      </div>
      <br />
      <hr />
      <br />
      <AgenciesAndRoutes />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const routes_req = await fetch('http://localhost:3000/api/routes');
  const routes = await routes_req.json() as Array<Route>;

  const agencies_req = await fetch('http://localhost:3000/api/agencies');
  const agencies = await agencies_req.json() as Array<Agency>;

  return {
    props: {
      data: { routes, agencies },
    }
  }
}