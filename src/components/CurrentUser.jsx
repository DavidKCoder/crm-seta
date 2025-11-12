import Image from "next/image";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";

const currentUserBase = { name: "John R.", avatar: "https://i.pravatar.cc/32?img=14" };

export default function CurrentUser() {
    const { role } = useCurrentUserRole();
    const currentUser = { ...currentUserBase, role };
    return (
        <div
            className="flex items-center h-10 rounded-md border border-transparent text-sm text-white transition-all shadow-sm hover:shadow-lg cursor-pointer">
            <div className="flex items-center gap-2 px-3">
                <Image
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                />
                <div className="grid leading-tight">
                    <span className="text-gray-700 font-medium text-sm">{currentUser.name}</span>
                    <span className="text-gray-500 text-[10px]">{currentUser.role}</span>
                </div>
            </div>
        </div>
    );
}