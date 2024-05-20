import { useState } from "react";
import { GetServerSideProps } from "next";
import { routes, agencies, Route, Agency } from "../utils/db";
import { RouteFC } from "../../components/Route";
import Head from "next/head";

type Props = {
  routes: Array<Route>;
  agencies: Array<Agency>;
};

export default function Stops({ routes, agencies }: Props) {
  const [value, setValue] = useState<string>();
  const [foundRoutes, setFoundRoutes] = useState<
    Array<{
      route_id: string;
      route_short_name: string;
      agency_name: string;
      route_type: number;
    }>
  >();
  const [routesLength, setRoutesLength] = useState<number>();
  const [visible, setVisible] = useState<boolean>();

  const findRoutes = (route_short_name: string) => {
    let arr: Array<{
      route_id: string;
      route_short_name: string;
      agency_name: string;
      route_type: number;
    }> = [];
    for (const route of routes) {
      if (route.route_short_name === route_short_name) {
        const agency_name = agencies.find(
          (agency) => agency.agency_id === route.agency_id,
        )?.agency_name as string;
        arr.push({
          agency_name,
          route_short_name,
          route_id: route.route_id,
          route_type: route.route_type,
        });
      }
    }

    setFoundRoutes(arr);
    setVisible(true);
  };

  const FoundRoutes: React.FC<{
    routes: Array<{
      route_id: string;
      route_short_name: string;
      agency_name: string;
      route_type: number;
    }>;
  }> = ({ routes }) => {
    if (routes) {
      let realRoutes: Array<{
        route_id: string;
        route_short_name: string;
        agency_name: string;
        route_type: number;
      }> = [];

      for (const route of routes) {
        let search = realRoutes.find(
          (s) =>
            s.agency_name === route.agency_name &&
            s.route_short_name === route.route_short_name,
        );
        if (search) {
          continue;
        } else {
          realRoutes.push(route);
        }
      }

      setRoutesLength(realRoutes.length);

      return realRoutes.map((route) => {
        return <RouteFC busData={route} />;
      });
    }
  };

  return (
    <div>
      <Head>
        <link rel="icon" href="images/icon.png" />
      </Head>
      <input
        className="input"
        placeholder="search for route"
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="button is-primary"
        onClick={() => findRoutes(value as string)}
      >
        search
      </button>
      <br />
      <hr />
      <br />

      <div style={{ display: visible ? "block" : "none" }}>
        <h3>
          Found {routesLength} {routesLength === 1 ? "route" : "routes"}
        </h3>
        <FoundRoutes
          routes={
            foundRoutes as Array<{
              route_id: string;
              route_short_name: string;
              agency_name: string;
              route_type: number;
            }>
          }
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const rts = await routes();
  const agncs = await agencies();

  return {
    props: {
      routes: rts,
      agencies: agncs,
    },
  };
};
