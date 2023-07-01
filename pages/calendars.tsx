import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

import type { Calendar } from "./api/calendars";

type Props = {
  data: Array<Calendar>
}

export default function Calendars({ data }: Props) {
  return data.map((calendar) => {
    return <div>{calendar.service_id}</div>
  });
}

export const getServerSideProps: GetServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const req = await fetch('http://localhost:3000/api/calendars');
  const calendars = await req.json() as Array<Calendar>;

  return {
    props: {
      data: calendars,
    }
  }
}