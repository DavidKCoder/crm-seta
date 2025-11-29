"use client"
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="text-black">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="text-black">
            <h1 className="text-xl font-bold mb-4">Welcome SETA CRM</h1>
            <p>Select a section from the menu on the left.</p>
        </div>
    );
}

