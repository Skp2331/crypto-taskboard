import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import toast from 'react-hot-toast';
import {
    Plus,
    Filter,
    ListTodo,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';

/**
 * Dashboard Page
 * Main task management interface
 */
const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0,
    });

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;

            const response = await taskAPI.getAll(params);
            setTasks(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch tasks');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, statusFilter, priorityFilter]);

    // Calculate stats from tasks
    useEffect(() => {
        const newStats = {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'pending').length,
            inProgress: tasks.filter(t => t.status === 'in-progress').length,
            completed: tasks.filter(t => t.status === 'completed').length,
            highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
        };
        setStats(newStats);
    }, [tasks]);

    // Fetch tasks on mount and when filters change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchTasks();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [fetchTasks]);

    // Create task
    const handleCreateTask = async (taskData) => {
        try {
            setIsSubmitting(true);
            await taskAPI.create(taskData);
            toast.success('Task created successfully!');
            setIsFormOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update task
    const handleUpdateTask = async (taskData) => {
        try {
            setIsSubmitting(true);
            await taskAPI.update(editingTask._id, taskData);
            toast.success('Task updated successfully!');
            setIsFormOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete task
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskAPI.delete(taskId);
            toast.success('Task deleted successfully!');
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        }
    };

    // Open edit form
    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    // Close form
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    // Clear filters
    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPriorityFilter('');
    };

    const hasActiveFilters = searchQuery || statusFilter || priorityFilter;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-slate-400">Manage your tasks and stay productive</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <ListTodo className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-sm text-slate-400">Total Tasks</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                                <p className="text-sm text-slate-400">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
                                <p className="text-sm text-slate-400">In Progress</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                                <p className="text-sm text-slate-400">Completed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* High Priority Alert */}
                {stats.highPriority > 0 && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400">
                            You have <span className="font-bold">{stats.highPriority}</span> high-priority task{stats.highPriority > 1 ? 's' : ''} that need{stats.highPriority === 1 ? 's' : ''} attention
                        </p>
                    </div>
                )}

                {/* Filters Section */}
                <div className="card mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search tasks by title or description..."
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input-field py-2.5 min-w-[140px]"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="input-field py-2.5 min-w-[140px]"
                            >
                                <option value="">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="btn-secondary"
                            >
                                Clear
                            </button>
                        )}

                        {/* Add Task Button */}
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <TaskList
                    tasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    isLoading={isLoading}
                />

                {/* Task Form Modal */}
                {isFormOpen && (
                    <TaskForm
                        task={editingTask}
                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                        onCancel={handleCloseForm}
                        isLoading={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
