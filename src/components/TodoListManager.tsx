import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task, TodoList } from '../types'; // Import the types
import './TodoListManager.css';

interface Props {
    state: { [key: string]: TodoList };
    setState: React.Dispatch<React.SetStateAction<{ [key: string]: TodoList }>>;
}

const TodoListManager: React.FC<Props> = ({ state, setState }) => {
    const { projectName } = useParams<{ projectName: string }>();
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [assignedDeveloper, setAssignedDeveloper] = useState('');

    const addTask = () => {
        if (!projectName) return; 
        const newTask: Task = {
            id: Date.now(),
            name: taskName,
            description: taskDescription,
            assignedDeveloper: assignedDeveloper,
            completed: false,
        };
        const newList = state[projectName]
            ? {
                  ...state[projectName],
                  tasks: [...state[projectName].tasks, newTask],
              }
            : {
                  name: projectName,
                  tasks: [newTask],
              };
        setState({ ...state, [projectName]: newList });
        setTaskName('');
        setTaskDescription('');
        setAssignedDeveloper('');
    };

    const toggleTaskCompleted = (taskId: number) => {
        const newList = { ...state[projectName] };
        newList.tasks = newList.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setState({ ...state, [projectName]: newList });
    };

    return (
        <div className='projects-container'>
            <h1>Project: {projectName}</h1>
            <div className="input-group">
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Task Name"
                />
                <input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Task Description"
                />
                <input
                    type="text"
                    value={assignedDeveloper}
                    onChange={(e) => setAssignedDeveloper(e.target.value)}
                    placeholder="Assigned Developer"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <div>
                {state[projectName]?.tasks.map((task) => (
                    <div key={task.id} className="task-item">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompleted(task.id)}
                        />
                        <span className={task.completed ? 'completed' : ''}>
                            {task.name} - {task.description} (Assigned to:{' '}
                            {task.assignedDeveloper})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoListManager;
