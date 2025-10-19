import { caller } from '@/trpc/server'
import React from 'react'

const Home = async () => {
  const accounts = await caller.getAccounts();
  return (
    <div>
      <h1>Accounts</h1>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </div>
  )
}

export default Home
