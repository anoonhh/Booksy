// import Link from 'next/link'
// import React from 'react'

// const HomeDesign = () => {
//   return (
//     <div>
//         <div className='pb-5'>
//             <h1 className="text-6xl font-bold text-gray-900 text-center mt-12 font-serif pt-5 ">
//             Discover Your<br/> Next Great Read
//             </h1>
//             <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
//             Welcome to <strong>Booksy</strong> — your personal library of stories, knowledge, and imagination. Explore bestsellers, hidden gems, and handpicked collections from every genre.
//             </p>
//         </div>

//         {/* section 2 */}
//         <img src='/images/harry_edited.png' className="absolute z-10 bottom-[-10px] left-[100px] w-[400px] h-auto "/>
//         <div className='relative bg-gradient-to-br from-[#fdf6f0] via-[#fbe9f0] to-[#e6d1dc] m-7 rounded-2xl min-h-[50vh] flex flex-col md:flex-row items-center justify-around p-6 '>
//             {/* img */}
//             <div className='w-full md:w-1/4 flex justify-center'>
//             </div>
//             {/* text */}
//             <div className='w-full md:w-1/4 text-center md:text-left mt-6 md:mt-0 px-10'>
//                 {/* <h2 className="text-3xl font-bold text-gray-800 mb-4">Unlock Worlds of Wonder</h2> */}
//                 <p className="text-gray-700 text-lg mb-6">
//                 Dive into stories that transport you beyond imagination. Whether you're looking for mystery, magic, or meaning—<strong>Booksy</strong> brings your next adventure to your fingertips.
//                 </p>
//                 <Link href={'/login'}>
//                 <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
//                 Get Started
//                 </button>
//                 </Link>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default HomeDesign




'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const HomeDesign = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Text Section */}
      <div className="pb-5">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center mt-12 font-serif pt-5">
          Discover Your<br />Next Great Read
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto px-4">
          Welcome to <strong>Booksy</strong> — your personal library of stories, knowledge, and imagination. Explore bestsellers, hidden gems, and handpicked collections from every genre.
        </p>
      </div>


      <div>

      {/* Image positioned absolutely (adjust for mobile and desktop) */}
        <Image
          src="/images/harry_edited.png"
          alt="Harry Potter Book"
          width={350}
          height={500} // Approximate value; adjust based on actual image ratio
          className="absolute z-10 bottom-[-25px] left-1/2 transform -translate-x-1/2 md:left-56 md:translate-x-0 w-52 sm:w-64 md:w-[350px] h-auto"
        />

      {/* Background Gradient Section */}
      <div className="relative z-0 bg-gradient-to-br from-[#fdf6f0] via-[#fbe9f0] to-[#e6d1dc] m-4 md:m-7 rounded-2xl min-h-[50vh] flex flex-col md:flex-row items-center justify-around p-6">
        {/* Image Placeholder (keeps layout balanced) */}
        <div className="hidden md:block w-full md:w-1/2" />

        {/* Text + Button Section */}
        <div className="w-full md:w-1/2 text-center md:text-left mt-6 md:mt-0 px-6 md:px-10">
          <p className="text-gray-700 text-base md:text-lg mb-6">
            Dive into stories that transport you beyond imagination. Whether you&apos;re looking for mystery, magic, or meaning—<strong>Booksy</strong> brings your next adventure to your fingertips.
          </p>
          <Link href="/login">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}

export default HomeDesign
