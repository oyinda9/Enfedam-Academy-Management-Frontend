"use client"
import React ,{useState} from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Ellipsis } from 'lucide-react';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY 
const events = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00 AM",
      description: "Discuss the project updates and upcoming milestones.",
    },
    {
      id: 2,
      title: "Code Review",
      time: "1:00 PM",
      description: "Review the latest pull requests and provide feedback.",
    },
    {
      id: 3,
      title: "Client Presentation",
      time: "3:00 PM",
      description: "Present the proposed solution to the client.",
    },
    {
      id: 4,
      title: "Workshop",
      time: "5:00 PM",
      description: "Attend a workshop on advanced JavaScript techniques.",
    },
  ];
  

const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());
  return (
    <div className='bg-white p-4 rounded-md'> <Calendar onChange={onChange} value={value} />
    <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold my-4 '>Events</h1>
        <Ellipsis className="cursor-pointer text-black" />
    </div>
    <div className='flex flex-col gap-4'>
        {events.map(events=>(
            <div className='p-5 rounded-md border-2 border-gray-200 border-t-4 odd:border-t-red-500 even:border-t-blue-500' key={events.id}>
                <div className='flex items-center justify-between '>
                    <h1 className='font-semibold text-gray-600'>{events.title}</h1>
                    <h1 className='font-semibold text-gray-400'>{events.time}</h1>
                </div>
                <p className='mt-2 text-black text-sm'>{events.description}</p>
            </div>
        ))}
    </div>
    </div>
  )
}

export default EventCalendar