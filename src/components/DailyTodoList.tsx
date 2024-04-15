import React, { useState } from 'react';
import './DailyTodoList.css';

interface Task {
    id: number;
    name: string;
    completed: boolean;
}

interface DailyTodoListProps {
    todos: Task[];
    setTodos: React.Dispatch<React.SetStateAction<Task[]>>;
}

const DailyTodoList: React.FC<DailyTodoListProps> = ({ todos, setTodos }) => {
    const [taskName, setTaskName] = useState('');

    const addTask = () => {
        if (taskName.trim()) {
            const newTask: Task = {
                id: Date.now(),
                name: taskName,
                completed: false,
            };
            setTodos([...todos, newTask]);
            setTaskName('');
        }
    };

    const toggleTaskCompleted = (id: number) => {
        const updatedTodos = todos.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTodos(updatedTodos);
    };

    const deleteTask = (id: number) => {
        const filteredTodos = todos.filter((task) => task.id !== id);
        setTodos(filteredTodos);
    };

    return (
        <div className="daily-container">
            <h1>Daily Tasks</h1>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter a task"
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {todos.map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompleted(task.id)}
                        />
                        <span
                            style={{
                                textDecoration: task.completed
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            {task.name}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>
                            x
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DailyTodoList;
