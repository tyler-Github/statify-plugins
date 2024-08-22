const { exec } = require('child_process');
const os = require('os');

/**
 * Helper function to execute shell commands.
 * @param {string} command - The command to run.
 * @returns {Promise<string>} - The command's output.
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * @type {Command}
 */
const processManagerPlugin = {
  name: 'process',
  description: 'Manages system processes (list, kill, info)',
  subcommands: [
    {
      name: 'list',
      description: 'Lists all running processes with their PID and name',
      execute: async () => {
        try {
          const command = os.platform() === 'win32' ? 'tasklist' : 'ps aux';
          const output = await runCommand(command);
          return { text: `Processes:\n${output}`, type: 'output' };
        } catch (error) {
          return { text: `Error listing processes: ${error.message}`, type: 'error' };
        }
      },
    },
    {
      name: 'kill',
      description: 'Kills a process by its PID',
      execute: async (args) => {
        if (args.length === 0) {
          return { text: 'Usage: kill <PID>', type: 'error' };
        }

        const pid = args[0];
        const command = os.platform() === 'win32' ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;

        try {
          await runCommand(command);
          return { text: `Process ${pid} terminated.`, type: 'output' };
        } catch (error) {
          return { text: `Error killing process: ${error.message}`, type: 'error' };
        }
      },
    },
    {
      name: 'info',
      description: 'Gets information about a specific process by its PID',
      execute: async (args) => {
        if (args.length === 0) {
          return { text: 'Usage: info <PID>', type: 'error' };
        }

        const pid = args[0];
        const command = os.platform() === 'win32'
          ? `wmic process where processid=${pid} get description,processid`
          : `ps -p ${pid} -o pid,comm,%cpu,%mem`;

        try {
          const output = await runCommand(command);
          return { text: `Process Info:\n${output}`, type: 'output' };
        } catch (error) {
          return { text: `Error getting process info: ${error.message}`, type: 'error' };
        }
      },
    },
    {
      name: 'help',
      description: 'Lists all available process manager commands or provides help on a specific command',
      execute: async (args) => {
        if (args.length === 0) {
          return {
            text: processManagerPlugin.subcommands
              .map(cmd => `${cmd.name}: ${cmd.description}`)
              .join('\n'),
            type: 'output',
          };
        }

        const command = args[0];
        const cmd = processManagerPlugin.subcommands.find(cmd => cmd.name === command);
        if (cmd) {
          return { text: `${command}: ${cmd.description}`, type: 'output' };
        }

        return { text: `No help available for command "${command}".`, type: 'error' };
      },
    },
  ],
  execute: () => ({ text: 'This command has subcommands. Use "process <subcommand>"', type: 'error' }),
};

module.exports = {
  commands: {
    [processManagerPlugin.name]: processManagerPlugin
  }
};
