import { NextPage, NextPageContext } from 'next'
import * as React from 'react'
import { api } from '~/config'
import type { User } from '~/types'
import Layout from '../../../ui/Layout'

type Props = {
  key: string
  profile: User
}

async function getInitialProps({ query }: NextPageContext): Promise<Props> {
  const userId = query.id as string
  const [profile] = await Promise.all([api.getUserProfile({ id: userId })])

  return { key: userId, profile }
}

const ProfilePage: NextPage<Props> = ({ profile }) => {
  return (
    <Layout title={profile.name} sidebar={<div />}>
      <h3>{profile.name}</h3>
      <small>{profile.id}</small>
    </Layout>
  )
}

ProfilePage.getInitialProps = getInitialProps

export default ProfilePage
