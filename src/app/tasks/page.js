"use client";

import { useState } from "react";
import { LiaEdit } from "react-icons/lia";
import { TbTrashX } from "react-icons/tb";
import { initialColumns, columnNames } from "../data";
import TaskModal from "@/components/TaskModal";

export default function TasksPage() {
    const [columns, setColumns] = useState(initialColumns);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentColumn, setCurrentColumn] = useState(null);
    const [editingTask, setEditingTask] = useState(null); // добавили состояние для редактирования

    const openModal = (columnKey, task = null) => {
        setCurrentColumn(columnKey);
        setEditingTask(task); // если task передан — редактируем, иначе создаем новый
        setIsModalOpen(true);
    };

    const saveTask = (taskData) => {
        if (!taskData.title.trim()) return;

        if (editingTask) {
            // редактирование существующей задачи
            const updatedTasks = columns[currentColumn].map((task) =>
                task.id === editingTask.id
                    ? {
                        ...task,
                        title: taskData.title,
                        users: taskData.users
                            ? taskData.users.split(",").map((u) => u.trim())
                            : [],
                        tags: taskData.tags
                            ? taskData.tags.split(",").map((t) => t.trim())
                            : [],
                    }
                    : task,
            );
            setColumns({ ...columns, [currentColumn]: updatedTasks });
        } else {
            // добавление новой задачи
            const taskToAdd = {
                id: Date.now(),
                title: taskData.title,
                users: taskData.users
                    ? taskData.users.split(",").map((u) => u.trim())
                    : [],
                tags: taskData.tags
                    ? taskData.tags.split(",").map((t) => t.trim())
                    : [],
            };
            setColumns({
                ...columns,
                [currentColumn]: [...columns[currentColumn], taskToAdd],
            });
        }

        setEditingTask(null);
        setIsModalOpen(false);
    };

    const removeTask = (columnKey, taskId) => {
        const newTasks = columns[columnKey].filter((item) => item.id !== taskId);
        setColumns({ ...columns, [columnKey]: newTasks });
    };

    return (
        <div className="p-0">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Tasks</h1>
            </div>

            <div className="p-4 flex gap-4 rounded-lg overflow-x-auto bg-gray-100">
                {Object.keys(columns).map((key) => (
                    <div
                        key={key}
                        className="bg-white border-1 border-gray-200 rounded-lg shadow p-4 min-w-[250px] flex flex-col h-fit"
                    >
                        <h2 className="mb-4 p-2 rounded-lg bg-[#4F47A5] text-white">
                            {columnNames[key]}
                        </h2>
                        <div className="flex-1 flex flex-col gap-3">
                            {columns[key].map((task) => (
                                <div key={task.id}
                                     className="border border-gray-200 rounded-lg p-2 shadow bg-gray-50 relative flex flex-col gap-2">
                                    {/* Текст задачи */}
                                    <p className="text-sm font-medium">{task.title}</p>

                                    {/* Теги */}
                                    <div className="flex items-center gap-1">
                                        {task.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`w-20 h-1.5 rounded-full bg-${tag}-200`}
                                            ></span>
                                        ))}
                                    </div>

                                    {/* Аватары пользователей и кнопка удаления */}
                                    <div className="flex gap-1 mt-1 justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            {task.users.map((user, i) => (
                                                <img
                                                    key={i}
                                                    src={user}
                                                    alt="avatar"
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <LiaEdit
                                                size={16}
                                                onClick={() => openModal(key, task)}
                                                className="text-gray-500 cursor-pointer"
                                            />
                                            <TbTrashX
                                                size={16}
                                                onClick={() => removeTask(key, task.id)}
                                                className="cursor-pointer text-red-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="mt-4 text-white py-1 text-sm rounded bg-gray-300 hover:bg-[#4F47A5] cursor-pointer"
                            onClick={() => openModal(key)}
                        >
                            Add Task
                        </button>
                    </div>
                ))}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }}
                onSave={saveTask}
                task={editingTask} // передаем задачу для редактирования
            />
        </div>
    );
}
