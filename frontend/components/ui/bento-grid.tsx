import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
        className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4",
            className
        )}
        >
        {children}
        </div>
    );
    };

    export const BentoGridItem = ({
        title,
        startTime,
        thumbnail,
        className,
        href,
        header,
    }: {
        title?: string | React.ReactNode;
        startTime?: string | React.ReactNode;
        thumbnail?: string;
        className?: string;
        href: string;
        header?: React.ReactNode;
    }) => {
    return (
        <Link href={href} className={cn("rounded-xl border-b-4 border-r-4 border-b-slate-300 border-r-slate-300 cursor-pointer max-h-full group/bento hover:-translate-x-2 hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white flex-col",
        className)}>
            {/* {header} */}
            <div className="rounded-md overflow-hidden transition duration-200">
                {/* <Image src={thumbnail as string} alt={title as string} width={200} height={100} className="object-cover rounded-md" /> */}
                <img src={thumbnail as string} alt={title as string} className={`w-full max-h-[20rem]`} />
            </div>
            <div className=" transition duration-200">
                <div className="font-normal text-neutral-600 text-xs dark:text-neutral-300 mt-2">
                    {startTime}
                </div>
                <div className="text-wrap leading-tight font-bold text-neutral-600 dark:text-neutral-200">
                    {title}
                </div>
            </div>
        </Link>
    );
};
