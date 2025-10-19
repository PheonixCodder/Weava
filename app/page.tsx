import { caller } from '@/trpc/server'
import React from 'react'

const Home = async () => {
  const res = await caller.getUser()
  return (
    <div>
      {JSON.stringify(res)}
      
    </div>
  )
}

export default Home
