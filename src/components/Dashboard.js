import React from 'react'
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const {data: session} = useSession();
  return (
    <>
      <div className="text-blue-900 flex justify-between">
        <h2 className="mt-0">
          <div className='flex gap-2 items-center'>
            <img src={session?.user?.image} alt='' className="w-10 h-10 overflow-hidden rounded-full sm:hidden" />
            <div>
              <b>Hello, {session?.user?.name}</b>
            </div>
          </div>
        </h2>
        <div className='hidden sm:block'>
          <div className="flex gap-1 rounded-lg items-center">
            <img src={session?.user?.image} alt='' className="w-12 h-12 overflow-hidden rounded-full" />
            <span className="px-2 font-medium">
              {session?.user?.name}<br/>
              {session?.user?.email}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard