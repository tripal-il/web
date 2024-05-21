import { useEffect, useState } from "react";
import { ClosestStop, StopFC } from "../components/Stop";
import type { Stop } from "../utils/db";
import { calculateDistance, walkingTime } from "../utils/closestStop";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
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

export default function Home({ data }: Props) {
  const [value, setValue] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [foundStops, setFoundStops] = useState<Array<FoundStop>>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const stopsPerPage = 4;

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
  const currentStops = foundStops.slice(indexOfFirstStop, indexOfLastStop);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  const findStops = (query: string) => {
    const filteredStops = data
      .filter((stop) =>
        stop.stop_name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((stop) => {
        const distance = calculateDistance(
          location?.latitude,
          location?.longitude,
          stop.stop_lat,
          stop.stop_lon,
        );
        const walkingTimeValue = walkingTime(distance);
        return {
          ...stop,
          distance,
          walkingTime: walkingTimeValue,
        };
      });
    setFoundStops(filteredStops);
    setCurrentPage(1);
    setVisible(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Head>
        <link rel="icon" href="/images/icon.png" />
        <title>Tripal</title>
      </Head>
      <header>
        <Image alt="Tripal" src={"/images/logo.png"} width={1000} height={70} />
      </header>
      <br />
      <hr />
      <br />
      <h3 className="font-semibold text-xl">
        Closest stops:
      </h3>
      <br />
      <ClosestStop data={data} />
      <div className="mt-6">
        <input
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          style={{ color: "black" }}
          placeholder="Search for stops"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => findStops(value as string)}
          >
            Search
          </button>
        </div>
        <hr className="my-6" />
        {visible && (
          <div className="justify-center grid grid-cols-1 gap-4">
            {currentStops.length === 0 ? (
              <p>No stops found.</p>
            ) : (
              currentStops.map((stop) => (
                <StopFC
                  key={stop.stop_id}
                  stop_name={stop.stop_name}
                  stop_id={stop.stop_id}
                  stop_code={stop.stop_code}
                  stop_lat={stop.stop_lat}
                  stop_lon={stop.stop_lon}
                />
              ))
            )}
            {foundStops.length > stopsPerPage && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(foundStops.length / stopsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(foundStops.length / stopsPerPage)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  _ctx: GetServerSidePropsContext,
) => {
  const rq = await axios.get('http://localhost:8080/stops');
  const stps = rq.data;

  return {
    props: {
      data: stps,
    },
  };
};
