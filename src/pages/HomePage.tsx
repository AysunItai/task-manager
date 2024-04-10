import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

interface HomePageProps {
    projects: { [key: string]: any };
    setProjects: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}

const HomePage: React.FC<HomePageProps> = ({ projects, setProjects }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleCreateProject = () => {
        if (projectName.trim() !== '') {
            const trimmedName = projectName.trim();
            navigate(`/todo/${trimmedName}`);
            setProjects((prev) => ({ ...prev, [trimmedName]: { tasks: [] } }));
            handleCloseModal();
        }
    };

    const handleDeleteProject = (projectKey: string) => {
        const updatedProjects = { ...projects };
        delete updatedProjects[projectKey];
        setProjects(updatedProjects);
    };

    const goToDailyTasks = () => {
        navigate('/daily-todos');
    };

    return (
        <div className="homepage">
            <h1>Home Page</h1>
            <div className="project-section">
                <div className="btn-container">
                    <button onClick={goToDailyTasks} className="daily-todos-btn">
                        Create a Todo List for Today
                    </button>
                    <button
                        onClick={handleOpenModal}
                        className="create-project-btn"
                    >
                        Create a new Project Task List
                    </button>
                </div>
                <h2>Existing Projects</h2>
                <ul className="project-list">
                    {Object.keys(projects).map((key) => (
                        <li key={key}>
                            <Link to={`/todo/${key}`}>{key}</Link>
                            <button
                                onClick={() => handleDeleteProject(key)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>Enter Project Name</h2>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Project Name"
                        />
                        <button onClick={handleCreateProject}>Create</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
