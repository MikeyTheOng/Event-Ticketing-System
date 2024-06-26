"use client"
import { useState, useEffect } from 'react';

import { VerifyTicketForm } from "@/components/TicketingOfficer/verifyTicketForm";
import { IssueTicketsForm } from "@/components/TicketingOfficer/issueTicketsForm";
import { PhysicalTicketSales } from "@/components/TicketingOfficer/physicalTicketSales"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
export function TOFunctions() {
    const [feature, setFeature] = useState('verify');
    
    useEffect(() => {
        console.log("Feature:", feature);
    }, [feature]);

    return (
        <div className="mx-auto mt-5 p-12 pr-8 bg-white w-3/5 border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-xl">
            <div className="flex justify-end relative">
                <Select value={feature} onValueChange={setFeature}>
                    <SelectTrigger className="w-[180px] text-slate-600 font-medium tracking-tighter absolute">
                        <SelectValue placeholder="Verify" className=""/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="verify" className="text-slate-500 tracking-tighter">Verify</SelectItem>
                        <SelectItem value="issue" className="text-slate-500 tracking-tighter">Issue e-Tickets</SelectItem>
                        <SelectItem value="on-siteSales" className="text-slate-500 tracking-tighter">On-site Sales</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="">
                {
                    feature == "verify" ? 
                        <VerifyTicketForm /> :
                    feature == "issue" ? 
                        <IssueTicketsForm /> :
                    feature == "on-siteSales" ?
                        <PhysicalTicketSales /> : null
                }
            </div>
        </div>
    )
}
