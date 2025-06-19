import React from 'react'
import { Brain,Sun } from 'lucide-react';

function Navbar() {
  return (
    <div className='nav flex items-center px-5 py-5 h-17 bg-zinc-900' >
     <div className='logo flex items-center  gap-1'>
        <Brain className=''/>
        <span className='text-2xl font-bold text-white ml-1'>SyntaxSniffer</span>
     </div>

    </div>
  )
}

export default Navbar
