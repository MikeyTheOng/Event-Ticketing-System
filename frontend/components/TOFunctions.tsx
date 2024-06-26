"use client"
import { useState, useEffect } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
export function TOFunctions() {
    const [feature, setFeature] = useState('verify');
    useEffect(() => {
        console.log("Feature:", feature);
    }, [feature]);
    return (
        <div className="mx-auto mt-5 p-4 bg-white w-3/5 aspect-video border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 shadow-md rounded-xl">
            <div className="flex justify-end">
                <Select value={feature} onValueChange={setFeature}>
                    <SelectTrigger className="w-[180px] text-slate-600 font-medium tracking-tighter">
                        <SelectValue placeholder="Verify" className=""/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="verify" className="text-slate-500 tracking-tighter">Verify</SelectItem>
                        <SelectItem value="issue" className="text-slate-500 tracking-tighter">Issue e-Tickets</SelectItem>
                        <SelectItem value="on-siteSales" className="text-slate-500 tracking-tighter">On-site Sales</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {
                feature == "verify" ? 
                    <div>
                        Verify
                    </div> :
                feature == "issue" ? 
                    <div>
                        Issue
                    </div> :
                feature == "on-siteSales" ?
                    <div>
                        On-site Sales
                    </div> : null
            }
        </div>
    )
}
