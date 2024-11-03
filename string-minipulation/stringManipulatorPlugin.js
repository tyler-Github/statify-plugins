/**
 * @type {Command}
 */
const stringManipulatorPlugin = {
  name: 'stringManipulator',
  description: 'Performs basic string manipulation operations',
  subcommands: [
    {
      name: 'uppercase',
      description: 'Converts a string to uppercase',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: uppercase <string>', type: 'error' };
        }

        const inputString = args.join(' ');
        return { text: `Uppercase: ${inputString.toUpperCase()}`, type: 'output' };
      },
    },
    {
      name: 'reverse',
      description: 'Reverses a string',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: reverse <string>', type: 'error' };
        }

        const inputString = args.join(' ');
        const reversedString = inputString.split('').reverse().join('');
        return { text: `Reversed: ${reversedString}`, type: 'output' };
      },
    },
    {
      name: 'length',
      description: 'Calculates the length of a string',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: length <string>', type: 'error' };
        }

        const inputString = args.join(' ');
        return { text: `Length: ${inputString.length}`, type: 'output' };
      },
    },
    {
      name: 'concat',
      description: 'Concatenates two strings',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: concat <string1> <string2>', type: 'error' };
        }

        const [string1, string2] = args;
        return { text: `Concatenated: ${string1 + string2}`, type: 'output' };
      },
    },
    {
      name: 'help',
      description: 'Lists all available string manipulation commands or provides help on a specific command',
      execute: (args) => {
        if (args.length === 0) {
          return {
            text: stringManipulatorPlugin.subcommands
              .map(cmd => `${cmd.name}: ${cmd.description}`)
              .join('\n'),
            type: 'output',
          };
        }

        const command = args[0];
        const cmd = stringManipulatorPlugin.subcommands.find(cmd => cmd.name === command);
        if (cmd) {
          return { text: `${command}: ${cmd.description}`, type: 'output' };
        }

        return { text: `No help available for command "${command}".`, type: 'error' };
      },
    },
  ],
  execute: () => ({ text: 'This command has subcommands. Use "stringManipulator <subcommand>"', type: 'error' }),
};

module.exports = {
  commands: {
    [stringManipulatorPlugin.name]: stringManipulatorPlugin
  }
};
