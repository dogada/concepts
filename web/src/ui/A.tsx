import Link from 'next/link'
import { ReactElement, ReactNode } from 'react'

export function A({
  href,
  children
}: {
  href: string
  children: ReactNode
}): ReactElement {
  return /#/.test(href) ? (
    <a href={href}>{children}</a>
  ) : (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  )
}
