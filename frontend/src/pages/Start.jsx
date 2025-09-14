import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='h-screen pt-9 bg-cover bg-bottom inver bg-[url(https://imgs.search.brave.com/0aNrhVMVuigTyJF2XgLASiqcvo0ZpPdB4xf4ILCA7Eg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzA4Lzlh/L2RiLzA4OWFkYjEy/ZmIxOTM1ZDRlYzYz/YzM3ODJhOTU4MDYw/LmpwZw)]  w-full flex justify-between flex-col'>
        <img className=' w-20 h-20 invert ml-9 font-bold rounded-full' src="/icons/logo2.png" alt="IMG" />
        <div className='bg-white py-3 px-3 pb-7 '>
            <h2 className='text-3xl font-bold text-center'>Get Started</h2>
            <Link to='/login' className='bg-red-600 flex items-center justify-center w-full text-white rounded-lg py-3 text-2xl mt-5'>Continue</Link>
        </div>
    </div>
  )
}

export default Start