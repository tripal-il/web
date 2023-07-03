import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { Agency } from "../api/agencies";
import { Route } from "../api/routes";
import Link from "next/link";

type Props = {
  routes: Array<Route>
  agencies: Array<Agency>
}

export default function Stops({ routes, agencies }: Props) {
  const [value, setValue] = useState<string>();
  const [foundRoutes, setFoundRoutes] = useState<Array<{ route_id: string, route_short_name: string, agency_name: string }>>();
  const [visible, setVisible] = useState<boolean>();
  const router = useRouter();

  const findRoutes = (route_short_name: string) => {
    let arr: Array<{ route_id: string, route_short_name: string, agency_name: string }> = [];
    for (const route of routes) {
      if (route.route_short_name === route_short_name) {
        const agency_name = agencies.find((agency) => agency.agency_id === route.agency_id)?.agency_name as string;
        arr.push({ agency_name, route_short_name, route_id: route.route_id });
      }
    }

    setFoundRoutes(arr);
    setVisible(true);
  }

  const FoundRoutes: React.FC<{ routes: Array<{ route_id: string, route_short_name: string, agency_name: string }> }> = ({ routes }) => {
    if (routes) {
      return routes.map((route) => {
        return (
          <div>
            <Link href={`/trips/${route.route_id}`}>{route.route_short_name} ({route.agency_name})</Link>
          </div>
        )
      });
    }
  }

  return (
    <div>
      <input placeholder="search for route" onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => findRoutes(value as string) }>search</button>
      <br />
      <hr />
      <br />

      <div style={{ display: visible ? 'block' : 'none' }}>
        <FoundRoutes routes={foundRoutes as Array<{ route_id: string, route_short_name: string, agency_name: string }>} />
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const routes_req = await fetch("http://localhost:3000/api/routes");
  const routes = await routes_req.json();

  const agencies_req = await fetch('http://localhost:3000/api/agencies');
  const agencies = await agencies_req.json();

  return {
    props: {
      routes,
      agencies
    }
  }
}