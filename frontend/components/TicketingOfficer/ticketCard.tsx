import { useState, useEffect } from 'react';

export function TicketCard({index, handleUpdateTicket} : {index: number, handleUpdateTicket: Function}) {
    return(
        <div className='col-span-1 flex-col bg-white px-6 py-2 mb-2 border border-slate-300 border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-lg'>
            <h4 className="text-lg font-medium tracking-tighter">Ticket Number: <span className="text-pri-500">{index + 1}</span></h4>
            <div className="flex items-center gap-1">
                Number of Guests:
                <input
                    className="w-[3rem] text-xl text-black text-center font-light tracking-tighter py-1.5 pb-0.5 border border-slate-500 focus:outline-pri-500 rounded-lg"
                    name="name"
                    placeholder="1"
                    onChange={(e)=>{handleUpdateTicket(index, Number(e.target.value))}}
                    type="number"
                    defaultValue={1}
                    autoComplete="off"
                    min={1}
                    max={4}
                    onKeyDown={(e) => {e.preventDefault();}}
                />
            </div>
        </div>
    )
}