import { Edit2, Trash2, Calendar, Tag, Clock } from 'lucide-react';

/**
 * TaskList Component
 * Displays a list of tasks with actions
 */
const TaskList = ({ tasks, onEdit, onDelete, isLoading }) => {
    // Get priority badge class
    const getPriorityClass = (priority) => {
        const classes = {
            high: 'priority-high',
            medium: 'priority-medium',
            low: 'priority-low',
        };
        return classes[priority] || classes.medium;
    };

    // Get status badge class
    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            'in-progress': 'status-in-progress',
            completed: 'status-completed',
        };
        return classes[status] || classes.pending;
    };

    // Format status text
    const formatStatus = (status) => {
        const labels = {
            pending: 'Pending',
            'in-progress': 'In Progress',
            completed: 'Completed',
        };
        return labels[status] || status;
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Check if due date is past
    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'completed') return false;
        return new Date(dueDate) < new Date();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="loading-spinner w-10 h-10"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">No tasks found</h3>
                <p className="text-slate-500">Create a new task to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <div
                    key={task._id}
                    className="card card-hover p-4 group"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {/* Title and badges */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h3 className={`font-medium ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(task.status)}`}>
                                    {formatStatus(task.status)}
                                </span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityClass(task.priority)}`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                            </div>

                            {/* Description */}
                            {task.description && (
                                <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                {/* Due date */}
                                {task.dueDate && (
                                    <span className={`flex items-center gap-1 ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : ''}`}>
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(task.dueDate)}
                                        {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                                    </span>
                                )}

                                {/* Tags */}
                                {task.tags && task.tags.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {task.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-1.5 py-0.5 bg-slate-700/50 rounded text-slate-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(task)}
                                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                title="Edit task"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(task._id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete task"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
