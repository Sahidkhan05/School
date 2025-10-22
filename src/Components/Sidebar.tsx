import React, { useState } from 'react'

// icons
import { ImBooks } from "react-icons/im";
import { MdMenuOpen } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { IoMegaphoneOutline } from "react-icons/io5";

const menuItems = [
  {
    icons: <ImBooks size={30} />,
    label: 'Subject'
  },
  {
    icons: <SiGoogleclassroom size={30} />,
    label: 'ClassRoom'
  },
  {
    icons: <FaChalkboardTeacher size={30} />,
    label: 'Class'
  },
  {
    icons: <FaUserCheck size={30} />,
    label: 'Attendance'
  },
  {
    icons: <IoMegaphoneOutline size={30} />,
    label: 'Notice'
  },
  {
    icons: <FaMoneyBillWave size={30} />,
    label: 'Fee Model'
  },
  {
    icons: <FaBookOpen size={30} />,
    label: 'Homework'
  }
]

export default function Sidebar() {

  const [open, setOpen] = useState(true)

  return (
    <nav className={`shadow-md h-screen p-2 flex flex-col duration-500 bg-blue-600 text-white ${open ? 'w-60' : 'w-16'}`}>

      {/* Header */}
      <div className=' px-3 py-2 h-20 flex justify-between items-center'>
        <img src="/images/Navonous_Logo.png" alt="Logo" className={`${open ? 'w-20' : 'w-0'} rounded-md`} />
        <div><MdMenuOpen size={34} className={` duration-500 cursor-pointer ${!open && ' rotate-180'}`} onClick={() => setOpen(!open)} /></div>
      </div>

      {/* Body */}

      <ul className='flex-1'>
        {
          menuItems.map((item, index) => {
            return (
              <li key={index} className='px-3 py-2 my-2 hover:bg-blue-800 rounded-md duration-300 cursor-pointer flex gap-2 items-center relative group'>
                <div>{item.icons}</div>
                <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
                <p className={`${open && 'hidden'} absolute left-32 shadow-md rounded-md
                 w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
                `}>{item.label}</p>
              </li>
            )
          })
        }
      </ul>
      {/* footer */}
      <div className='flex items-center gap-2 px-3 py-2'>
        <div><FaUserCircle size={30} /></div>
        <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
          <p>XYZ</p>
          <span className='text-xs'>abc@gmail.com</span>

        </div>
      </div>


    </nav>
  )
}