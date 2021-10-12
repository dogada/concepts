import * as React from 'react'
import Button from 'react-bootstrap/Button'
import Layout from '~/ui/Layout'
import Icon from '~/ui/Icon'

const LoginPage: React.FunctionComponent = () => (
  <Layout title="About">
    <h1>Sign In</h1>
    <Button href="/api/auth/google">
      <Icon id="google3" /> Google
    </Button>
  </Layout>
)

export default LoginPage
