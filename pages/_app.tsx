import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-blue text-white">
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp
