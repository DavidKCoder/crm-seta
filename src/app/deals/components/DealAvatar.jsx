export function DealAvatar({ deal }) {
    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(/\s+/);
        return words.length === 1
            ? words[0].substring(0, 2).toUpperCase()
            : (words[0][0] + words[1][0]).toUpperCase();
    };

    const initials = getInitials(
        deal?.name || `${deal?.firstName} ${deal?.lastName}`
    );

    function initialsToVibrantColor(str) {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = Math.abs(hash) % 360;   // 0–360
        const saturation = 70;              // strong color
        const lightness = 55;               // vibrant, not too dark

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }


    const color = initialsToVibrantColor(initials);

    return (
        <div
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
            style={{ backgroundColor: color }}
        >
            <span className="font-medium text-white">{initials}</span>
        </div>
    );
}
