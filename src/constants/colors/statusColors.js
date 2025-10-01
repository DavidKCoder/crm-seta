export const getStatusColor = (status) => {
    switch (status) {
        case "New":
            return "bg-sky-50 text-sky-700 border border-sky-200"; // Новый - свежий и привлекательный
        case "Pending":
            return "bg-amber-50 text-amber-900 border border-amber-300"; // Ожидание - требует внимания
        case "Approved":
            return "bg-emerald-50 text-emerald-900 border border-emerald-300"; // Успех - уверенный и спокойный
        case "Copy Writing":
            return "bg-violet-50 text-violet-900 border border-violet-300"; // Креатив - вдохновляющий
        case "Shooting":
            return "bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-300"; // Активный процесс - энергичный
        case "Design":
            return "bg-indigo-50 text-indigo-900 border border-indigo-300"; // Профессиональный этап
        case "Targeting":
            return "bg-cyan-50 text-cyan-900 border border-cyan-300"; // Аналитика - точный и ясный
        case "Completed":
            return "bg-green-50 text-green-900 border border-green-300"; // Завершён - окончательный успех
        case "Lost":
            return "bg-rose-50 text-rose-900 border border-rose-300"; // Потерян - чёткий и понятный
        default:
            return "bg-gray-50 text-gray-700 border border-gray-300"; // Нейтральный
    }
}