import '@/app/globals.css'
import {Metadata} from 'next'
import React from "react";
import { headers } from 'next/headers'

export const metadata: Metadata = {
    title: 'Web Game',
    description: 'A web game created with Next.js and shadcn UI',
}

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    const headersList = headers()
    const referer = headersList.keys().next().value
    console.log(headersList, referer)
    return (
        <html lang="en">
            <body>
            <div className="absolute top-2 right-2 text-xs z-10">
                {referer}
            </div>
            {children}</body>
        </html>
    )
}
