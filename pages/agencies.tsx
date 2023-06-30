import { GetServerSideProps, GetServerSidePropsContext } from "next";
import fetch from "node-fetch";

type Agency = {
  agency_id: string
  agency_name: string
  agency_url: string
  agency_timezone: string
  agency_lang: string
  agency_phone: string | null
  agency_fare_url: string | null
  agency_email: string | null
}

type Props = {
  data: Array<Agency>
}

export default function Agencies({ data }: Props) {
  return data.map((agency) => {
    return <div>{agency.agency_name}</div>
  });
}

export const getServerSideProps: GetServerSideProps = async (_ctx: GetServerSidePropsContext) => {
  const req = await fetch('http://localhost:3000/api/agencies');
  const agencies = await req.json() as Array<Agency>;

  return {
    props: {
      data: agencies,
    }
  }
}