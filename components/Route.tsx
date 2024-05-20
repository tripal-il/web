import { useRouter } from "next/router";

type Props = {
  busData: {
    route_id: string;
    route_short_name: string;
    agency_name: string;
    route_type: number;
  };
};
/**
 * 0 - Tram, Streetcar, Light rail. Any light rail or street level system within a metropolitan area.
 * 1 - Subway, Metro. Any underground rail system within a metropolitan area.
 * 2 - Rail. Used for intercity or long-distance travel.
 * 3 - Bus. Used for short- and long-distance bus routes.
 */

const RouteType: React.FC<{ t: number }> = ({ t }) => {
  switch (t) {
    case 0:
      // light rail icon
      break;
    case 1:
      // metro logo
      break;
    case 2:
      // train logo
      break;
    case 3:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mt-3"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <g
            id="feBus0"
            fill="none"
            fill-rule="evenodd"
            stroke="none"
            stroke-width="1"
          >
            <g id="feBus1" fill="currentColor" fill-rule="nonzero">
              <path
                id="feBus2"
                d="M16 19H8a2 2 0 1 1-4 0V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 1 1-4 0Zm1-4a1 1 0 1 0 0-2a1 1 0 0 0 0 2ZM7 15a1 1 0 1 0 0-2a1 1 0 0 0 0 2ZM6 5v6h12V5H6Z"
              />
            </g>
          </g>
        </svg>
      );
    default:
      return <div>Invalid</div>;
  }
};

export const RouteFC: React.FC<Props> = ({ busData }) => {
  const router = useRouter();
  return (
    <button
      className="flex gap-2 p-4 w-48 h-18 bg-[#2b333d] rounded-md shadow-md border-2 border-white hover:border-[#0388fc] duration-300 transition-all"
      onClick={() => router.push(`/trips/${busData.route_id}`)}
    >
      <RouteType t={busData.route_type} />
      <div className="flex flex-col">
        <h3 className="monserrat text-[#B0CFFF] text-left font-bold text-lg">
          {busData.route_short_name}
        </h3>
        <span className="dmsans text-left">{busData.agency_name}</span>
      </div>
    </button>
  );
};
