import Link from 'next/link'
import 'react'
import { ReactChild } from 'react'

const NavItem = (props: { href: string; children: ReactChild }) => (
  <li className="nav-item">
    <Link href={props.href}>
      <a className="nav-link">{props.children}</a>
    </Link>
  </li>
)

export default function Footer() {
  return (
    <footer
      className="bg-primary text-light mt-2"
      style={{ minHeight: '10vh' }}
    >
      <div className="container-xl py-3">
        <div>&copy; ConcepTS, 2021</div>
        <ul className="nav">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/about">About</NavItem>
        </ul>
      </div>
    </footer>
  )
}
