import { AppProps } from 'next/app'
import TagManager from 'react-gtm-module'
import { StoreonProvider } from '~/store'
import Root from '~/ui/Root'
import '../styles/light.scss'

if (typeof window !== 'undefined') {
  TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID })
}

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <StoreonProvider>
      <Root>
        <Component {...pageProps} />
      </Root>
    </StoreonProvider>
  )
}

export default MyApp
