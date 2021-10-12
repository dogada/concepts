import * as React from 'react'
import Button from 'react-bootstrap/Button'
import { Tab, TabPanel, VerticalTabs } from '~/concepts/tabs'
import { User } from '~/types'
import { ProfileForm } from '~/ui/account/ProfileForm'
import Layout from '~/ui/Layout'
import withMe from '~/ui/withMe'

type Props = {
  me: User
}
type TabId = 'home' | 'profile' | 'fav' | 'own'
type AccountTab = Tab<TabId>

const ACCOUNT_TABS: AccountTab[] = [
  { id: 'home', name: 'Home' },
  { id: 'profile', name: 'Edit profile' }
]

function AccountMenu({
  tab,
  onChange
}: {
  tab: AccountTab
  onChange: (tab: AccountTab) => void
}): React.ReactElement {
  return (
    <div className="mt-2">
      <VerticalTabs tabs={ACCOUNT_TABS} activeId={tab.id} onChange={onChange} />
    </div>
  )
}

const LogoutForm = () => (
  <form method="POST" action="/api/auth/logout">
    <Button variant="danger" className="mt-4" type="submit">
      Sign Out
    </Button>
  </form>
)

const AccountPage: React.FC<Props> = ({ me }) => {
  const [tab, setTab] = React.useState<AccountTab>(ACCOUNT_TABS[0])
  const panelProps = (id: TabId, preload = false) => ({
    tabId: id,
    active: tab.id === id,
    preload
  })
  return (
    <Layout
      title={`${tab.name} * Account`}
      sidebar={<AccountMenu tab={tab} onChange={setTab} />}
    >
      <h1>{tab.id === 'home' ? `${me.name} account` : tab.name}</h1>
      <div className="tab-content" id="account-tabs">
        <TabPanel {...panelProps('home')}>
          <dl className="row">
            <dt className="col-sm-3">User id</dt>
            <dd className="col-sm-9">{me.id}</dd>
          </dl>
          <LogoutForm />
        </TabPanel>
        <TabPanel {...panelProps('profile')}>
          <ProfileForm user={me} />
        </TabPanel>
      </div>
    </Layout>
  )
}

export default withMe(AccountPage)
