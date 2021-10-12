import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import { useStoreon } from 'storeon/react'
import { Events, State } from '~/store'
import { TypeaheadSearchField } from '~/ui/fields/TypeaheadSearchField'
import { getProfileUrl } from '~/urls'

function MenuItem({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <Dropdown.Item href={href}>{children}</Dropdown.Item>
    </Link>
  )
}

function AccountMenu() {
  const { me } = useStoreon<State, Events>('me')
  return (
    <DropdownButton
      alignRight
      title={me ? me.name?.charAt(0) : ''}
      id="accountMenu"
      className="float-right"
      size="sm"
      drop="down"
      variant="outline-secondary"
    >
      {me ? (
        [
          <MenuItem key="profile" href={getProfileUrl(me)}>
            Profile
          </MenuItem>,
          <MenuItem key="account" href="/auth/account">
            Account
          </MenuItem>
        ]
      ) : (
        <MenuItem href="/auth/login">Sign in</MenuItem>
      )}
    </DropdownButton>
  )
}

// TODO: replace Navbar component with html if we don't expand it anyway
export default function Header(): React.ReactElement {
  return (
    <Navbar
      bg="primary"
      as="header"
      variant="dark"
      sticky="top"
      expanded={true}
      className="justify-content-between"
    >
      <Link href="/">
        <Navbar.Brand href="/">
          <img
            src="/static/logo.png"
            width="32"
            height="32"
            alt="W"
            loading="lazy"
          />
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        id="basic-navbar-nav"
        className="justify-content-between"
      >
        <Form inline>
          <TypeaheadSearchField />
        </Form>
        <AccountMenu />
      </Navbar.Collapse>
    </Navbar>
  )
}
