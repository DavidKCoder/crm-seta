import { useEffect, useState } from "react";
import Image from "next/image";

export function DealAvatar({ deal }) {
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        setAvatar(`https://i.pravatar.cc/32?img=${Math.floor(Math.random() * 70)}`);
    }, []);

    if (!avatar) return null; // пока не смонтировалось, ничего не рендерим

    return (
        <Image
            src={avatar}
            alt={deal.name}
            width={32}
            height={32}
            className="rounded-full"
        />
    );
}
