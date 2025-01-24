import React from 'react'

const Pagination = () => {
  return (
    <div className='p-4 flex items-center justify-between text-gray-700'>
        <button disabled className='py-2 px-4 rounded-md bg-slate-300 text-xs font-semibold disabled:opacity-50 cursor-not-allowed'>Prev</button>
        <div className='flex items-center gap-3 text-sm'>
            <button className='px-2 rounded-md bg-[#60a5fa] text-white'>1</button>
            <button className='px-2 rounded-md bg-[#60a5fa] text-white'>2</button>
            <button className='px-2 rounded-md bg-[#60a5fa] text-white'>3</button>
            <button className='px-2 '>.....</button>
        </div>
        <button  className='py-2 px-4 rounded-md bg-slate-300 text-xs font-semibold disabled:opacity-50 cursor-not-allowed'>Next</button>
    </div>
  )
}

export default Pagination