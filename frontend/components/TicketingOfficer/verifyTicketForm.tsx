import { useState, useEffect } from 'react';

export function VerifyTicketForm(){
    const [ticketNo, setTicketNo] = useState('');
    const [verificationResult, setVerificationResult] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const verifyTicket = async (ticketId: number) => {
        try {
            const response = await fetch(`/api/ticket?ticketId=` + ticketId, {
                cache: "no-store",
            });
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.data.status == "verified"){
                    setVerificationResult(data.data.message);
                    setIsVerified(true);
                } else {
                    setVerificationResult(data.data.message);
                    setIsVerified(false);
                }
            } else {
                setIsVerified(false);
                console.error("verifyTicket error: response");
                throw new Error("Failed to verify ticket");
            }
        } catch (error) {
            setIsVerified(false);
            console.error("This is the error " + error);
        }
    };
    const handleVerify = async (e: any) => {
        e.preventDefault()

        // Handle verification button click
        if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
            if (ticketNo.trim() !== "") {
            // Check if input value is not empty
            const ticketId = parseInt(ticketNo.trim()); // Convert input value to number
            const ticketData = await verifyTicket(ticketId); // Fetch ticket details
            } else {
                setIsVerified(false);
                setVerificationResult("Please input a ticket number");
            }
        }
    };
    return(
        <div>
            <div className="rounded-t-lg">
                <h2 className="text-3xl text-slate-700 font-bold mb-1">Verify Ticket</h2>
                <div className="w-[50px] border-2 border-slate-700"></div>
            </div>
            <form className='mt-4' onSubmit={handleVerify}>
                <label className="text-slate-600 font-medium tracking-tight">
                    Ticket Number
                    <input
                        className="text-xl w-full text-black font-light tracking-tighter pl-1 pb-0.5 border-b border-b-slate-500 focus:outline-pri-500"
                        name="name"
                        placeholder="001"
                        value={ticketNo}
                        onChange={(e)=>{setTicketNo(e.target.value)}}
                        type="text"
                        autoComplete="off"
                    />
                </label>
                <div className='mt-4'>
                    {
                        ticketNo.length == 0 ? 
                        <button
                            onClick={(e) => handleVerify(e)}
                            className="w-full py-2 px-4 text-slate-400/70 font-medium border border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 bg-slate-100/50 shadow-md rounded-md cursor-not-allowed"
                            disabled
                        >
                            Verify Tickets
                        </button>
                        : 
                        <button
                            onClick={(e) => handleVerify(e)}
                            className="w-full py-2 px-4 text-slate-600 font-medium border border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-2 hover:-translate-y-2 shadow-md rounded-md transition-all duration-150 ease-in-out"

                        >
                            Verify Tickets
                        </button>
                    }
                </div>
                

            </form>
            <div>
                {
                    isVerified ? 
                    <p className={`mt-4 text-emerald-600 ${verificationResult.length == 0 ? 'hidden' : 'block'}`}>{verificationResult}</p> : 
                    <p className={`mt-4 text-red-500 ${verificationResult.length == 0 ? 'hidden' : 'block'}`}>{verificationResult}</p>
                }
            </div>
        </div>
    )
}