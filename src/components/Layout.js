import { useState } from "react";
import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import Logo from "./Logo";
import MenuButton from "./MenuButton";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);

  const { data: session } = useSession()

  if(!session) {

   return (
    <div className='bg-bgGray w-screen h-screen flex items-center'>
      <div className='text-center w-full'>
        <button 
          className='bg-primary text-white p-2 px-4 rounded-lg'
          onClick={() => signIn('google')}
          >Login with Google</button>
      </div>
    </div>
   ) 
  }
  
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center p-4">        
        <MenuButton setShowNav={setShowNav}/>

        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
        
      </div>
      <div className=" flex">
        <Nav showNav={showNav} />
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>

    </div>
  )
}
