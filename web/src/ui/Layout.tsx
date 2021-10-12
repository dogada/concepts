import clsx from 'clsx'
import Head from 'next/head'
import * as React from 'react'

function Layout({
  top,
  children,
  sidebar,
  aside,
  title = '',
  topSidebar = false
}: {
  top?: JSX.Element
  title?: string
  topSidebar?: boolean
  sidebar?: JSX.Element
  aside?: JSX.Element
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <Head>
        <title>
          {title} · {process.env.NEXT_PUBLIC_SITE_DOMAIN}
        </title>
      </Head>

      <div className="row">
        {top && <div className="col d-block d-md-none">{top}</div>}
        <nav
          className={clsx(
            'col-md-4 col-xl-3',
            topSidebar ? 'order-1' : 'order-3 order-md-1'
          )}
        >
          {sidebar}
        </nav>
        <main className="col-md-8 col-xl-6 order-2">
          {top && <div className="col d-none d-md-block">{top}</div>}
          {children}
        </main>
        <aside className="col-12 col-md-8 offset-md-4 offset-xl-0 col-xl-3 order-last">
          {aside}
        </aside>
      </div>
    </>
  )
}

export default Layout
