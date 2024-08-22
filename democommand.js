/**
 * @type {Command}
 */
const examplePluginCommand = {
    name: 'example',
    description: 'An example plugin command',
    subcommands: [
      {
        name: 'subcommand1',
        description: 'First subcommand',
        subcommands: [],
        execute: (args) => ({ text: `Subcommand1 executed with args: ${args.join(' ')}`, type: 'output' })
      },
      // Add more subcommands as needed
    ],
    execute: (args) => {
      return { text: `Example plugin command executed with args: ${args.join(' ')}`, type: 'output' };
    }
  };
  
  module.exports = {
    commands: {
      [examplePluginCommand.name]: examplePluginCommand
    }
  };
  