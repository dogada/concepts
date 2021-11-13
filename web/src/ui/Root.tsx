import Head from 'next/head'
import * as React from 'react'
import { useAlerts } from '~/store'

import Footer from './Footer'
import Header from './Header'
import { Message } from './AlertManager'
import AlertManager from './AlertManager'
import CookieConsent from 'react-cookie-consent'

const Root: React.FC<unknown> = function ({ children }) {
  const { alerts, dispatch } = useAlerts()
  const onAlertClose = (alert: Message) => dispatch('alerts/remove', alert)
  React.useEffect(() => dispatch('me/init'), [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        ></link>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <Header />
      <div className="position-relative">
        <AlertManager
          alerts={alerts}
          onAlertClose={onAlertClose}
          className="position-fixed w-50 ms-50p z-10"
        />
      </div>
      <div className="container-fluid" style={{ minHeight: '82vh' }}>
        {children}
      </div>
      <Footer />
      <CookieConsent
        containerClasses="bg-warning"
        buttonClasses="bg-info"
        onAccept={() => {
          // TODO: activate analytics
        }}
      >
        We use cookies to personalize content and ads, to provide social media
        features and to analyse our traffic.
      </CookieConsent>
    </>
  )
}

export default Root
