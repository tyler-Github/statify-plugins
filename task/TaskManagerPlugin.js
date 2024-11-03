/**
 * @type {Command}
 */
const taskManagerPlugin = {
  name: 'taskManager',
  description: 'Manages tasks with various operations like create, update, list, search, and delete',
  tasks: [],
  subcommands: [
    {
      name: 'create',
      description: 'Creates a new task with a title, description, priority, and optional due date',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: create <title> <description> [priority] [due date (YYYY-MM-DD)]', type: 'error' };
        }

        const [title, description, priority = 'medium', dueDate] = args;
        const id = taskManagerPlugin.tasks.length + 1;
        const newTask = { id, title, description, priority, dueDate: dueDate || null, status: 'pending' };
        taskManagerPlugin.tasks.push(newTask);

        return { text: `Task created: ID ${id}`, type: 'output' };
      },
    },
    {
      name: 'update',
      description: 'Updates the status or priority of a task by ID',
      execute: (args) => {
        if (args.length < 3) {
          return { text: 'Usage: update <task ID> <status|priority> <new value>', type: 'error' };
        }

        const [idStr, field, newValue] = args;
        const id = parseInt(idStr, 10);
        const task = taskManagerPlugin.tasks.find(task => task.id === id);

        if (!task) {
          return { text: `Error: Task with ID ${id} not found.`, type: 'error' };
        }

        if (field === 'status') {
          task.status = newValue;
          return { text: `Task ${id} status updated to ${newValue}.`, type: 'output' };
        } else if (field === 'priority') {
          task.priority = newValue;
          return { text: `Task ${id} priority updated to ${newValue}.`, type: 'output' };
        } else {
          return { text: 'Error: Invalid field. Use "status" or "priority".', type: 'error' };
        }
      },
    },
    {
      name: 'list',
      description: 'Lists all tasks or filters by status and/or priority',
      execute: (args) => {
        const [statusFilter, priorityFilter] = args;
        const filteredTasks = taskManagerPlugin.tasks.filter(task => {
          return (!statusFilter || task.status === statusFilter) &&
                 (!priorityFilter || task.priority === priorityFilter);
        });

        if (filteredTasks.length === 0) {
          return { text: 'No tasks found with the specified criteria.', type: 'output' };
        }

        const taskList = filteredTasks
          .map(task => `ID: ${task.id}, Title: ${task.title}, Status: ${task.status}, Priority: ${task.priority}, Due Date: ${task.dueDate || 'N/A'}`)
          .join('\n');

        return { text: taskList, type: 'output' };
      },
    },
    {
      name: 'delete',
      description: 'Deletes a task by ID',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: delete <task ID>', type: 'error' };
        }

        const id = parseInt(args[0], 10);
        const taskIndex = taskManagerPlugin.tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
          return { text: `Error: Task with ID ${id} not found.`, type: 'error' };
        }

        taskManagerPlugin.tasks.splice(taskIndex, 1);
        return { text: `Task ${id} deleted successfully.`, type: 'output' };
      },
    },
    {
      name: 'search',
      description: 'Searches tasks by keyword in title or description',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: search <keyword>', type: 'error' };
        }

        const keyword = args.join(' ').toLowerCase();
        const matchingTasks = taskManagerPlugin.tasks.filter(task => 
          task.title.toLowerCase().includes(keyword) || 
          task.description.toLowerCase().includes(keyword)
        );

        if (matchingTasks.length === 0) {
          return { text: 'No tasks found matching the keyword.', type: 'output' };
        }

        const taskList = matchingTasks
          .map(task => `ID: ${task.id}, Title: ${task.title}, Status: ${task.status}, Priority: ${task.priority}`)
          .join('\n');

        return { text: taskList, type: 'output' };
      },
    },
    {
      name: 'help',
      description: 'Lists all available task manager commands or provides help on a specific command',
      execute: (args) => {
        if (args.length === 0) {
          return {
            text: taskManagerPlugin.subcommands
              .map(cmd => `${cmd.name}: ${cmd.description}`)
              .join('\n'),
            type: 'output',
          };
        }

        const command = args[0];
        const cmd = taskManagerPlugin.subcommands.find(cmd => cmd.name === command);
        if (cmd) {
          return { text: `${command}: ${cmd.description}`, type: 'output' };
        }

        return { text: `No help available for command "${command}".`, type: 'error' };
      },
    },
  ],
  execute: () => ({ text: 'This command has subcommands. Use "taskManager <subcommand>"', type: 'error' }),
};

module.exports = {
  commands: {
    [taskManagerPlugin.name]: taskManagerPlugin
  }
};
