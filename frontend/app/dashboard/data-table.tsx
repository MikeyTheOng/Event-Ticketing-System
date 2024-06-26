"use client"
import { Button } from "@/components/ui/button"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,

    getSortedRowModel,
    getFilteredRowModel,

    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
}

export function DataTable<TData, TValue>({
        columns,
        data,
    }: DataTableProps<TData, TValue>) {
        const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { //This line
            pagination: {
                pageSize: 7,
            },
        },
    })
    return (
        <div>
            <div className="rounded-md border">
                <Table className="overflow-hidden">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const isIdHeader = header.column.columnDef.header === "ID";
                                    return (
                                        <TableHead key={header.id} className={`font-medium tracking-tightest ${isIdHeader ? 'hidden' : ''}`}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            }
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                >
                                {row.getVisibleCells().map((cell) => {
                                    const isIdHeader = cell.column.columnDef.header === "ID";
                                    return (
                                        <TableCell key={cell.id} className={`${isIdHeader ? 'hidden' : ''}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center space-x-2 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className=" border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-1 transition duration-200 ease-in-out"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className=" border-b-4 border-r-4 border-b-slate-400 border-r-slate-400 hover:border-b-pri-500 hover:border-r-pri-500 bg-white hover:text-pri-500 hover:-translate-x-1 transition duration-200 ease-in-out"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
