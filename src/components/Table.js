export default function Table({ headers, data }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
                <thead className="bg-gray-100">
                <tr>
                    {headers.map((h, i) => (
                        <th
                            key={i}
                            className="px-4 py-2 text-left font-medium text-gray-700"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((cell, j) => (
                            <td key={j} className="px-4 py-2">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
