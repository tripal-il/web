import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

import type { Stop } from "../api/stops";


type Props = {
  data: Stop
}

export default function StopByCode({ data }: Props) {
  return (
    <div style={{ textAlign: 'right' }}>
      <h1>{data.stop_name} (<small><i>{data.stop_code}</i></small>)</h1>
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