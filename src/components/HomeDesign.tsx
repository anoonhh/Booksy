


// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'

// const HomeDesign = () => {
//   return (
//     <div className="relative overflow-hidden">
//       {/* Hero Text Section */}
//       <div className="pb-5">
//         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-center mt-12 font-serif pt-5">
//           Discover Your<br />Next Great Read
//         </h1>
//         <p className="mt-4 text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto px-4">
//           Welcome to <strong>Booksy</strong> — your personal library of stories, knowledge, and imagination. Explore bestsellers, hidden gems, and handpicked collections from every genre.
//         </p>
//       </div>


//       <div>

//       {/* Image positioned absolutely (adjust for mobile and desktop) */}
//         <Image
//           src="/images/harry_edited.png"
//           alt="Harry Potter Book"
//           width={350}
//           height={500} // Approximate value; adjust based on actual image ratio
//           className="absolute z-10 bottom-[-25px] left-1/2 transform -translate-x-1/2 md:left-56 md:translate-x-0 w-52 sm:w-64 md:w-[350px] h-auto"
//         />

//       {/* Background Gradient Section */}
//       <div className="relative z-0 bg-gradient-to-br from-[#fdf6f0] via-[#fbe9f0] to-[#e6d1dc] m-4 md:m-7 rounded-2xl min-h-[50vh] flex flex-col md:flex-row items-center justify-around p-6">
//         {/* Image Placeholder (keeps layout balanced) */}
//         <div className="hidden md:block w-full md:w-1/2" />

//         {/* Text + Button Section */}
//         <div className="w-full md:w-1/2 text-center md:text-left mt-6 md:mt-0 px-6 md:px-10">
//           <p className="text-gray-700 text-base md:text-lg mb-6">
//             Dive into stories that transport you beyond imagination. Whether you&apos;re looking for mystery, magic, or meaning—<strong>Booksy</strong> brings your next adventure to your fingertips.
//           </p>
//           <Link href="/login">
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
//               Get Started
//             </button>
//           </Link>
//         </div>
//       </div>
//       </div>
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
    <div className="relative bg-stone-200 min-h-screen mb-20 overflow-hidden">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero text */}
        <div className="text-center py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-serif">
            Discover Your<br />Next Great Read
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
            Welcome to <strong>Booksy</strong> — your personal library of stories, knowledge, and imagination. Explore bestsellers, hidden gems, and handpicked collections from every genre.
          </p>
        </div>

        {/* Grid content section */}
        <div className="bg-gradient-to-br from-[#fdf6f0] via-[#fbe9f0] to-[#e6d1dc] rounded-3xl p-10 md:p-16 lg:p-20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16 items-center">
            
            {/* Book image */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/images/harry_edited.png"
                alt="Harry Potter Book"
                width={350}
                height={450}
                priority
                className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] h-auto object-contain"
              />
            </div>

            {/* Text + Button */}
            <div>
              <p className="text-gray-700 text-base md:text-lg mb-6">
                Dive into stories that transport you beyond imagination. Whether you're looking for mystery, magic, or meaning—<strong>Booksy</strong> brings your next adventure to your fingertips.
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
    </div>
  )
}

export default HomeDesign


