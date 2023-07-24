import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ margin: '45px' }}>
      <div className="title is-2">Hey there!</div>
      <br />
      <br />
      <br />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'space-between' }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => router.push('/trips') }>
          <div className="card-content">
            <div className="media-content">
              Search for routes
            </div>
          </div>
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => router.push('/stops') }>
          <div className="card-content">
            <div className="media-content">
              Find stops
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
