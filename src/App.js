import React, { useState, useEffect } from 'react';
import { Plus, Flag, Calendar, Edit3, X } from 'lucide-react';

const KanbanTodoApp = () => {
  // Initialize with empty tasks - force clear existing data
  const [tasks, setTasks] = useState(() => {
    // Clear any existing saved tasks
    window.todoAppTasks = [];
    return [];
  });

  // Save tasks to window object for persistence
  useEffect(() => {
    window.todoAppTasks = tasks;
  }, [tasks]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  // Category icons mapping
  const categoryIcons = {
    personal: '👤',
    home: '🏠',
    kids: '👶'
  };

  const priorityColors = {
    low: 'bg-gradient-to-br from-green-100 to-green-200 border-green-200 bg-blend-multiply',
    high: 'bg-gradient-to-br from-rose-100 to-pink-200 border-rose-200 bg-blend-multiply'
  };

  // Add new task
  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date(),
      alarmSet: taskData.dueDate ? true : false
    };
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };

  // Update task
  const updateTask = (id, updates) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    switch(filterBy) {
      case 'high': filtered = filtered.filter(t => t.priority === 'high'); break;
      case 'mid': filtered = filtered.filter(t => t.priority === 'mid'); break;
      case 'low': filtered = filtered.filter(t => t.priority === 'low'); break;
      case 'flagged': filtered = filtered.filter(t => t.flagged); break;
      case 'alarm': filtered = filtered.filter(t => t.dueDate); break;
      case 'personal': filtered = filtered.filter(t => t.category === 'personal'); break;
      case 'home': filtered = filtered.filter(t => t.category === 'home'); break;
      case 'kids': filtered = filtered.filter(t => t.category === 'kids'); break;
    }

    // Sort tasks
    switch(sortBy) {
      case 'priority': 
        const priorityOrder = { high: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'priority-asc':
        const priorityOrderAsc = { high: 2, low: 1 };
        filtered.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority]);
        break;
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case 'dueDate-asc':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return -1;
          if (!b.dueDate) return 1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        });
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'category-asc':
        filtered.sort((a, b) => b.category.localeCompare(a.category));
        break;
      case 'created-asc':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default: // created
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  // Check for due alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.dueDate && task.alarmSet) {
          const dueTime = new Date(task.dueDate);
          if (dueTime <= now && dueTime > new Date(now.getTime() - 60000)) {
            alert(`⏰ Task due: ${task.title}`);
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">My Tasks</h1>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus size={16} /> Add Task
          </button>
          
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-2 py-2 border rounded text-sm flex-1 min-w-0"
          >
            <option value="all">All Tasks</option>
            <optgroup label="Priority">
              <option value="high">High Priority</option>
              <option value="low">Low Priority</option>
            </optgroup>
            <optgroup label="Status">
              <option value="flagged">Flagged</option>
              <option value="alarm">With Alarms</option>
            </optgroup>
            <optgroup label="Category">
              <option value="personal">👤 Personal</option>
              <option value="home">🏠 Home</option>
              <option value="kids">👶 Kids</option>
            </optgroup>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-2 border rounded text-sm flex-1 min-w-0"
          >
            <option value="created">Created ↓</option>
            <option value="created-asc">Created ↑</option>
            <option value="priority">Priority ↓</option>
            <option value="priority-asc">Priority ↑</option>
            <option value="dueDate">Due Date ↓</option>
            <option value="dueDate-asc">Due Date ↑</option>
            <option value="category">Category ↓</option>
            <option value="category-asc">Category ↑</option>
          </select>
        </div>
      </div>

      {/* Task List by Category */}
      <div className="space-y-4">
        {['personal', 'kids', 'home'].map(category => {
          const categoryTasks = getFilteredTasks().filter(task => task.category === category);
          if (categoryTasks.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">
                {categoryIcons[category]} {category}
              </h3>
              <div className="space-y-1">
                {categoryTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask(task.id)}
                    onUpdate={updateTask}
                    categoryIcons={categoryIcons}
                    priorityColors={priorityColors}
                  />
                ))}
              </div>
            </div>
          );
        })}
        {getFilteredTasks().length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks found. {filterBy !== 'all' ? 'Try changing the filter.' : 'Add your first task!'}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddingTask && (
        <TaskModal
          onSave={addTask}
          onCancel={() => setIsAddingTask(false)}
          categoryIcons={categoryIcons}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          onSave={(data) => updateTask(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
          categoryIcons={categoryIcons}
        />
      )}
    </div>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onUpdate, categoryIcons, priorityColors }) => {
  const toggleFlag = () => {
    onUpdate(task.id, { flagged: !task.flagged });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return date.toLocaleDateString();
  };

  return (
    <div className={`border rounded p-2 shadow-sm hover:shadow-md transition-shadow ${priorityColors[task.priority]} relative`}
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
           backgroundSize: '20px 20px'
         }}>
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-xs">{categoryIcons[task.category]}</span>
          {task.dueDate && formatDate(task.dueDate) === 'Today' && (
            <span className="text-red-500 text-sm">❗</span>
          )}
          <span className="text-sm text-gray-900 flex-1 leading-tight break-words font-medium">{task.title}</span>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={toggleFlag}
            className={`p-1 rounded hover:bg-gray-100 ${task.flagged ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Flag size={10} className={task.flagged ? 'fill-current' : ''} />
          </button>
          <button onClick={onEdit} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <Edit3 size={10} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-gray-100 text-red-400">
            <X size={10} />
          </button>
        </div>
      </div>
      
      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1 ml-4 relative z-10">
          <Calendar size={8} />
          <span className={formatDate(task.dueDate) === 'Overdue' ? 'text-red-600 font-medium' : ''}>
            {formatDate(task.dueDate)}
          </span>
        </div>
      )}
    </div>
  );
};

const TaskModal = ({ task, onSave, onCancel, categoryIcons }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    priority: task?.priority || 'low',
    category: task?.category || 'personal',
    dueDate: task?.dueDate || '',
    flagged: task?.flagged || false,
    notes: task?.notes || ''
  });

  const handleSave = () => {
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
        <h2 className="text-lg font-bold mb-4">{task ? 'Edit Task' : 'Add New Task'}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 h-24 resize-y"
              placeholder="Add any additional notes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="low">🟢 Low</option>
                <option value="high">🟡 High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                {Object.entries(categoryIcons).map(([key, icon]) => (
                  <option key={key} value={key}>{icon} {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date (optional)</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.flagged}
                onChange={(e) => setFormData({...formData, flagged: e.target.checked})}
                className="rounded"
              />
              <span className="text-sm font-medium">🚩 Flag for close watching</span>
            </label>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {task ? 'Update' : 'Add'} Task
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanTodoApp;
