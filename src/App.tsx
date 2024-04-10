import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TodoListManager from './components/TodoListManager';
import DailyTodoList from './components/DailyTodoList';
import { loadState, saveState } from './utils/storage';

const App: React.FC = () => {
    const [projects, setProjects] = useState(loadState('projects') || []);
    
    const [dailyTodos, setDailyTodos] = useState(loadState('dailyTodos') || []);

    useEffect(() => {
        saveState('projects', projects);
    }, [projects]);

    useEffect(() => {
        saveState('dailyTodos', dailyTodos);
    }, [dailyTodos]);


    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            projects={projects}
                            setProjects={setProjects}
                        />
                    }
                />
                <Route
                    path="/todo/:projectName"
                    element={
                        <TodoListManager state={projects} setState={setProjects} />
                    }
                />
                <Route path="/daily-todos" element={<DailyTodoList todos={dailyTodos} setTodos={setDailyTodos} />} />
            </Routes>
        </Router>
    );
};

export default App;
