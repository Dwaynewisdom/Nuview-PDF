import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <>
    <nav className='m-5 border-2 bg-orange-700 border-gray-300 shadow-lg shadow-black/20 rounded-2xl p-6 flex flex-row items-center justify-between gap-4'>
        <div>
                <a href = "/" className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>NuView PDF</a>
            <p className="text-lg text-white/90 mt-1">Your PDFs, through a NU lens.</p>
        </div>
        <div className='flex flex-row'>
            <ul className='flex flex-row gap-3 list-none m-0 p-0'>
                <li>
                    <a href ="" className='inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'>Login</a>
                </li>
                <li>
                    <a href ="" className='inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'>Sign Up</a>
                </li>
            </ul>
        </div>
    </nav>
    </>
  )
}

export default Navbar;