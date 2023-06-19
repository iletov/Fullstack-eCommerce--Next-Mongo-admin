import React from 'react'
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const {data: session} = useSession();
  return (
    <>
      <div className="text-blue-900 flex justify-between">
        <h2 className="mt-0">
          <b>Hello, {session?.user?.name}</b>
        </h2>
        <div>
          <div className="flex bg-gray-300 text-black gap-1 rounded-lg">
            <img src={session?.user?.image} alt='' className="w-8 h-8 overflow-hidden" />
            <span className="px-2">
              {session?.user?.name}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard