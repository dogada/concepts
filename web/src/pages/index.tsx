import { NextPage } from 'next'
import * as React from 'react'
import Layout from '../ui/Layout'

export const HomePage: NextPage = () => {
  return (
    <Layout title="ConceptTS">
      <div className="p-5 mb-4 bg-light">
        <div className="py-5">
          <h1 className="display-5 fw-bold">ConcepTS</h1>
          <p className="lead mt-4 fs-4">
            ConcepTS is a Web Framework based on TypeScript.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
