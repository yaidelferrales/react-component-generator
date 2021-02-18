const indexjs = `
import React from 'react';

// Styles imports
import 'style.css';

/**
 * COMPONENT_NAME component
 * 
 * @returns React.Component
 */ 
function COMPONENT_NAME(props) {
    return 'Hello from COMPONENT_NAME!';
}

export default COMPONENT_NAME;

`;

const testjs = '/* COMPONENT_NAME tests */';

const styles = '/* COMPONENT_NAME styles */';

module.exports = { indexjs, testjs, styles };
