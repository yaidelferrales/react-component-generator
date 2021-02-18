#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');

// Local imports
const { indexjs, testjs, styles } = require('./templates');

async function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function runProcess() {
    const args = process.argv.splice(2);
    const workingDir = process.cwd();
    let componentName = null;

    if (!args.length) {
        componentName = await askQuestion('What is the component name? ');
    } else {
        componentName = args[0];
    }

    var dir = `${workingDir}/${componentName}`;

    if (fs.existsSync(dir)) {
        console.error(`\n\nError: A folder witht the name ${componentName} already exists`);
        return;
    }

    fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/style.css`, styles.replace(/COMPONENT_NAME/g, componentName));
    fs.writeFileSync(`${dir}/index.test.js`, testjs.replace(/COMPONENT_NAME/g, componentName));
    fs.writeFileSync(`${dir}/index.js`, indexjs.replace(/COMPONENT_NAME/g, componentName));
}

module.exports = runProcess;
