import React from 'react'
import { Brain,Sun } from 'lucide-react';

function Navbar() {
  return (
    <div className=' nav flex items-center rounded-2xl shadow-2xl px-5 py-5 mx-3  h-17 bg-[radial-gradient(circle_at_30%_30%,_#702963,_#1e3a8a)] ' >
     <div className='logo flex items-center  gap-1'>
        <Brain className=''/>
        <span className=' text-2xl font-bold text-white ml-1'>SyntaxSniffer</span>
     </div>

    </div>
  )
}

export default Navbar
