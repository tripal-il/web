import Head from "next/head"

export default function Home() {
  return (
    <div>
      <Head>
        <link rel="icon" href="images/icon.png" />
      </Head>
      <div className="ml-10 mt-10 flex justify-center">
        <img src="/images/logo.png" width={500}></img>
      </div>
    </div>
  )
}
