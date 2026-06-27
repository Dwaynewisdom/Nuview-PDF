import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <>
    <nav className='m-5 border-2 bg-orange-700 border-gray-300 shadow-lg shadow-black/20 rounded-2xl p-6 flex flex-row items-center justify-between gap-4'>
        <div>
                <Link to = "/" className="text-4xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>NuView PDF</Link>
            <p className="text-lg text-white/90 mt-1">Your PDFs, through a NU lens.</p>
            <ul className='flex gap-3 ml-14 mt-2'>
                <li className="w-7 h-7 mt-">
                <a href ="https://nuview.it.com/" target='_blank'><img src="https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@8ba4dfe353b3e5a8e349fa9fb4818e5c52af1e58/Images/logo.png"></img></a>
                </li>
                <li className="w-7 h-7 mt-">
                    <a href="https://www.linkedin.com/feed/" target='_blank'><img src="https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@d0da4c8807943da012923a3db35062b9f25efcc4/instagram.png"></img></a>
                </li>
                <li className="w-7 h-7 mt-">
                    <a href ="https://x.com/Nuview2026"><img src="https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@d0da4c8807943da012923a3db35062b9f25efcc4/X.png" target="_blank"></img></a>
                </li>
            </ul>
        </div>

        {/*<div className='flex flex-row'>
            <ul className='flex flex-row gap-3 list-none m-0 p-0 h-25 '>
                <li>
                    <a href ="" className='inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'>Login</a>
                </li>
                <li>
                    <a href ="" className='inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'>Sign Up</a>
                </li>
            </ul>
        </div>*/}
    </nav>
    </>
  )
}

export default Navbar;