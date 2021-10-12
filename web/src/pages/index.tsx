import { NextPage } from 'next'
import * as React from 'react'
import Layout from '../ui/Layout'

export const HomePage: NextPage = () => {
  return (
    <Layout title="ConceptTS">
      <div className="jumbotron">
        <h1>ConcepTS</h1>
        <p className="lead mt-4">
          ConcepTS is a Web Framework based on TypeScript.
        </p>
      </div>
    </Layout>
  )
}

export default HomePage
