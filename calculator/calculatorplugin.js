/**
 * @type {Command}
 */
const calculatorPlugin = {
  name: 'calculator',
  description: 'Performs basic arithmetic operations',
  subcommands: [
    {
      name: 'add',
      description: 'Adds two numbers',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: add <number1> <number2>', type: 'error' };
        }

        const [num1, num2] = args.map(Number);
        if (isNaN(num1) || isNaN(num2)) {
          return { text: 'Error: Both arguments must be numbers.', type: 'error' };
        }

        return { text: `The sum of ${num1} and ${num2} is ${num1 + num2}.`, type: 'output' };
      },
    },
    {
      name: 'subtract',
      description: 'Subtracts the second number from the first number',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: subtract <number1> <number2>', type: 'error' };
        }

        const [num1, num2] = args.map(Number);
        if (isNaN(num1) || isNaN(num2)) {
          return { text: 'Error: Both arguments must be numbers.', type: 'error' };
        }

        return { text: `The result of ${num1} minus ${num2} is ${num1 - num2}.`, type: 'output' };
      },
    },
    {
      name: 'multiply',
      description: 'Multiplies two numbers',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: multiply <number1> <number2>', type: 'error' };
        }

        const [num1, num2] = args.map(Number);
        if (isNaN(num1) || isNaN(num2)) {
          return { text: 'Error: Both arguments must be numbers.', type: 'error' };
        }

        return { text: `The product of ${num1} and ${num2} is ${num1 * num2}.`, type: 'output' };
      },
    },
    {
      name: 'divide',
      description: 'Divides the first number by the second number',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: divide <number1> <number2>', type: 'error' };
        }

        const [num1, num2] = args.map(Number);
        if (isNaN(num1) || isNaN(num2)) {
          return { text: 'Error: Both arguments must be numbers.', type: 'error' };
        }
        if (num2 === 0) {
          return { text: 'Error: Division by zero is not allowed.', type: 'error' };
        }

        return { text: `The result of ${num1} divided by ${num2} is ${num1 / num2}.`, type: 'output' };
      },
    },
    {
      name: 'power',
      description: 'Raises the first number to the power of the second number',
      execute: (args) => {
        if (args.length < 2) {
          return { text: 'Usage: power <base> <exponent>', type: 'error' };
        }

        const [base, exponent] = args.map(Number);
        if (isNaN(base) || isNaN(exponent)) {
          return { text: 'Error: Both arguments must be numbers.', type: 'error' };
        }

        return { text: `${base} raised to the power of ${exponent} is ${Math.pow(base, exponent)}.`, type: 'output' };
      },
    },
    {
      name: 'sqrt',
      description: 'Calculates the square root of a number',
      execute: (args) => {
        if (args.length < 1) {
          return { text: 'Usage: sqrt <number>', type: 'error' };
        }

        const number = Number(args[0]);
        if (isNaN(number)) {
          return { text: 'Error: The argument must be a number.', type: 'error' };
        }
        if (number < 0) {
          return { text: 'Error: Cannot calculate the square root of a negative number.', type: 'error' };
        }

        return { text: `The square root of ${number} is ${Math.sqrt(number)}.`, type: 'output' };
      },
    },
    {
      name: 'help',
      description: 'Lists all available calculator commands or provides help on a specific command',
      execute: (args) => {
        if (args.length === 0) {
          return {
            text: calculatorPlugin.subcommands
              .map(cmd => `${cmd.name}: ${cmd.description}`)
              .join('\n'),
            type: 'output',
          };
        }

        const command = args[0];
        const cmd = calculatorPlugin.subcommands.find(cmd => cmd.name === command);
        if (cmd) {
          return { text: `${command}: ${cmd.description}`, type: 'output' };
        }

        return { text: `No help available for command "${command}".`, type: 'error' };
      },
    },
  ],
  execute: () => ({ text: 'This command has subcommands. Use "calculator <subcommand>"', type: 'error' }),
};

module.exports = {
  commands: {
    [calculatorPlugin.name]: calculatorPlugin
  }
};
