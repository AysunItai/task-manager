import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import './TodoListManager.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Modal from '../utils/NoteModal'; // Import the modal component


interface TodoList {
    name: string;
    tasks: Task[];
}
interface Task {
    id: number;
    name: string;
    description: string;
    completed?: boolean; 
    assignedeveloper?: string;
    notes?: string;
}

interface Props {
    state: { [key: string]: TodoList };
    setState: React.Dispatch<React.SetStateAction<{ [key: string]: TodoList }>>;
}

// NoteModal component (assume imported or defined above)

const NoteButton: React.FC<{ onDrop: (taskId: number) => void }> = ({
    onDrop,
}) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'note',
            item: { type: 'note' },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [onDrop]
    );

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
        >
            Drag to add/edit note
        </div>
    );
};
const TaskItem: React.FC<{
    task: Task;
    onNoteButtonClick: (taskId: number) => void;
    toggleCompletion: (taskId: number) => void;  // Passing the toggle function
}> = ({ task, onNoteButtonClick, toggleCompletion }) => {
    const [, drop] = useDrop(() => ({
        accept: 'note',
        drop: () => {
            onNoteButtonClick(task.id);
            return { name: `Dropped on task ${task.id}` };
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))

   // Handling checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        toggleCompletion(task.id);
    };

    return (
        <div ref={drop} className="task-item">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={handleCheckboxChange}  // Now with an onChange handler
            />
            <span className={task.completed ? 'completed' : ''}>
                {task.name} - {task.description}
            </span>
            {task.notes && (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNoteButtonClick(task.id);
                    }}
                    style={{ marginLeft: '10px' }}
                >
                    View/Edit Note
                </a>
            )}
        </div>
    );
};



    

const TodoListManager: React.FC<Props> = ({ state, setState }) => {
    const { projectName } = useParams<{ projectName?: string }>();
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [assignedDeveloper, setAssignedDeveloper] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
    const [currentNote, setCurrentNote] = useState('');

    const handleOpenModal = (taskId: number) => {
        if (projectName) {
            const task = state[projectName]?.tasks.find((t:Task) => t.id === taskId);
            setCurrentTaskId(taskId);
            setCurrentNote(task?.notes || '');
            setModalOpen(true);
        }
    };

   const handleSaveNote = (note: string) => {
      if (projectName) {
          const updatedTasks = state[projectName]?.tasks.map((task : Task) =>
              task.id === currentTaskId ? { ...task, notes: note } : task
          );
          if (updatedTasks) {
              setState((prevState) => ({
                  ...prevState,
                  [projectName]: {
                      ...prevState[projectName],
                      tasks: updatedTasks,
                  },
              }));
              setModalOpen(false);
          }
      }
       
   };


    
    const addTask = () => {
        if (!projectName) return; 
        const newTask: Task = {
            id: Date.now(),
            name: taskName,
            description: taskDescription,
            assignedeveloper: assignedDeveloper,
            notes:'ghgjhgjg'
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
        if (!projectName) {
            console.error('Project name is undefined.');
            return;
        }
        const project = state[projectName];
        if (!project) {
            console.error('Project not found.');
            return;
        }
        const newList = {
            ...project,
            tasks: project.tasks.map((task: Task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            ),
        };
        setState((prevState) => ({ ...prevState, [projectName]: newList }));
    };


    return (
        <DndProvider backend={HTML5Backend}>
            <div className="projects-container">
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
                    <NoteButton onDrop={handleOpenModal} />
                    {projectName &&
                        state[projectName]?.tasks.map((task: Task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onNoteButtonClick={handleOpenModal}
                                toggleCompletion={toggleTaskCompleted} // Passing the function
                            />
                        ))}
                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        onSave={handleSaveNote}
                        currentNote={currentNote}
                    />
                </div>
            </div>
        </DndProvider>
    );
};

export default TodoListManager;
