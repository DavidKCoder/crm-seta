export const HeadIconButton = ({ icon: Icon, badge }) => {
    return (
        <div className="relative inline-flex">
            <button
                className="flex items-center justify-center h-10 w-10 rounded-md text-purple-800 hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:shadow-lg cursor-pointer"
                type="button"
            >
                <Icon size={22} />
            </button>
            {badge && (
                <span
                    className="absolute -top-1.5 -right-1.5 grid min-h-[20px] min-w-[20px] place-items-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {badge}
        </span>
            )}
        </div>
    );
};
