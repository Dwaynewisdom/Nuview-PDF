import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
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
                    <a href="https://www.instagram.com/nuview2026/?hl=en" target='_blank'><img src="https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@d0da4c8807943da012923a3db35062b9f25efcc4/instagram.png"></img></a>
                </li>
                <li className="w-7 h-7 mt-">
                    <a href ="https://x.com/Nuview2026"><img src="https://cdn.jsdelivr.net/gh/Dwaynewisdom/Portfolio-New@d0da4c8807943da012923a3db35062b9f25efcc4/X.png" target="_blank"></img></a>
                </li>
            </ul>
        </div>

        <div className='flex flex-col'>
            <ul className='flex flex-col gap-3 list-none m-0 p-0 h-25 '>
              {isLoading ? (
                <li className='inline-flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-2xl font-semibold'>Checking auth...</li>
              ) : isAuthenticated ? (
                <>
                  
                  <li className='hidden sm:inline-flex items-center text-white/90 font-bold mr-2'>
                    Hi, {user?.name ?? user?.email}
                  </li>
                  <li>
                    <button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      className='inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                  <>
                  <a href="/Loginandsign" className='inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-2xl font-semibold shadow transition-transform transform hover:scale-105 duration-200'>
                    <li>
                      <button
                        className='inline-flex items-center justify-center px-4 py-2 text-white font-semibold transition-transform transform hover:scale-105 duration-200'
                      >
                        Login
                      </button>
                    </li>
                  </a>
                </>
              )}
            </ul>
        </div>
    </nav>
    </>
  )
}

export default Navbar;