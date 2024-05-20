import { useEffect, useState } from "react";
import { ClosestStop, StopFC } from "../../components/Stop";
import type { Stop } from "../utils/db";
import { calculateDistance, walkingTime } from "../utils/closestStop";
import { stops } from "../utils/db";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

type Props = {
  data: Array<Stop>;
};

type FoundStop = {
  stop_name: string;
  stop_id: string;
  stop_code: string;
  stop_lat: number;
  stop_lon: number;
  distance: any;
  walkingTime: string;
};

export default function Stops({ data }: Props) {
  const [value, setValue] = useState<string>();
  const [visible, setVisible] = useState<boolean>();
  const [foundStops, setFoundStops] = useState<Array<FoundStop>>();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [stopsPerPage] = useState<number>(7);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  const indexOfLastStop = currentPage * stopsPerPage;
  const indexOfFirstStop = indexOfLastStop - stopsPerPage;
  const currentStops = foundStops?.slice(indexOfFirstStop, indexOfLastStop);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  const findStops = (query: string) => {
    let filteredStops: Array<FoundStop> = [];
    for (const stop of data) {
      if (stop.stop_name.toLowerCase().includes(query.toLowerCase())) {
        const distance = calculateDistance(
          location?.latitude,
          location?.longitude,
          stop.stop_lat,
          stop.stop_lon,
        );
        const walkingTimeValue = walkingTime(distance);
        filteredStops.push({
          ...stop,
          distance,
          walkingTime: walkingTimeValue,
        });
      }
    }
    setFoundStops(filteredStops);
    setCurrentPage(1);
    setVisible(true);
  };

  const FoundStops: React.FC<{ stops: Array<FoundStop> }> = ({ stops }) => {
    if (!stops || stops.length === 0) {
      return <p>No stops found.</p>;
    }

    return stops.map((stop) => (
      <StopFC
        key={stop.stop_id}
        stop_name={stop.stop_name}
        stop_id={stop.stop_id}
        stop_code={stop.stop_code}
        stop_lat={stop.stop_lat}
        stop_lon={stop.stop_lon}
        // closest={(closestStop as Stop).stop_name === stop.stop_name ? true : false}
      />
    ));
  };

  return (
    <div style={{ margin: "45px" }}>
      <Head>
        <link rel="icon" href="images/icon.png" />
      </Head>
      <h1 className="title">Search for stops</h1>
      <ClosestStop data={data} />
      <br />
      <div>
        <input
          className="input"
          placeholder="Search for stops"
          onChange={(e) => setValue(e.target.value)}
          style={{ color: "black" }}
        />
        <button
          className="button is-primary"
          onClick={() => findStops(value as string)}
        >
          Search
        </button>
        <br />
        <hr />
        <br />

        <div style={{ display: visible ? "block" : "none" }}>
          <FoundStops stops={currentStops || []} />
        </div>

        {foundStops && foundStops.length > stopsPerPage && (
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            &nbsp;
            <span>{`Page ${currentPage} of ${Math.ceil(foundStops.length / stopsPerPage)}`}</span>
            <button
              onClick={nextPage}
              disabled={
                currentPage === Math.ceil(foundStops.length / stopsPerPage)
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  _ctx: GetServerSidePropsContext,
) => {
  const stps = await stops();

  return {
    props: {
      data: stps,
    },
  };
};
