import '@/app/globals.css'
import {Metadata} from 'next'
import React from "react";

export const metadata: Metadata = {
    title: 'Web Game',
    description: 'A web game created with Next.js and shadcn UI',
}

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
