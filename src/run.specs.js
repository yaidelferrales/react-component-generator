const readline = require('readline');
const fs = require('fs');

const createComponent = require('./run');
const { indexjs, testjs, styles } = require('./templates');

describe('generation works', () => {
    const OLD_ARGV = process.argv;

    beforeEach(() => {
        jest.resetAllMocks();

        jest.mock('fs');
        fs.mkdirSync = jest.fn();
        fs.writeFileSync = jest.fn();

        process.argv = [null, null];
    });

    afterAll(() => {
        process.argv = OLD_ARGV;
    });

    test('component not generated because folder already exists', () => {
        // Add the name to the process.argv
        const componentName = 'Demo';
        process.argv.push(componentName);

        // Mock the existSync function
        fs.existsSync = jest.fn(() => true);

        // Backup the console.error and mock it
        const consoleError = console.error;
        console.error = jest.fn();

        // Run the function
        createComponent();

        expect(fs.existsSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}`);
        expect(console.error).toHaveBeenCalledWith(`\n\nError: A folder witht the name ${componentName} already exists`);

        // Restore console.error
        console.error = consoleError;
    });

    test('the files are generated if name provided', () => {
        // Add the name to the process.argv
        const componentName = 'Demo';
        process.argv.push(componentName);

        // Run the function
        createComponent();

        expect(fs.mkdirSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}`);
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/style.css`, styles.replace(/COMPONENT_NAME/g, componentName));
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/index.js`, indexjs.replace(/COMPONENT_NAME/g, componentName));
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/index.test.js`, testjs.replace(/COMPONENT_NAME/g, componentName));
    });

    test('the files are generated and name asked', async () => {
        const componentName = 'Demo';

        jest.mock('readline');
        readline.createInterface = jest.fn(({ input }) => ({
            close: jest.fn(),
            question: (_, callback) => {
                input.end();
                callback(componentName)
            },
        }));

        // Run the function
        await createComponent();

        expect(readline.createInterface).toHaveBeenCalled();
        expect(fs.mkdirSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}`);
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/style.css`, styles.replace(/COMPONENT_NAME/g, componentName));
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/index.js`, indexjs.replace(/COMPONENT_NAME/g, componentName));
        expect(fs.writeFileSync).toHaveBeenCalledWith(`${process.cwd()}/${componentName}/index.test.js`, testjs.replace(/COMPONENT_NAME/g, componentName));
    });
});
