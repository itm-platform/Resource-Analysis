// errorHandler.js

/**
 * Calls /tools.itmplatform.com:8081/logFrontendErrors (logAPI MS) which will log the error in MongoDB (Node, 52.211.119.160)
 * and will send an email to the ITM Platform team, as configured in the email MS
 * @param {Object} error - The error object
 * @param {Object} generator - The generator object
 * @param {string} generator.application - The application name
 * @param {string} generator.component - The component name, if any
 * @param {string} generator.info - The info string, if any.
 * @returns {void}
 * @example logFrontEndError(error, { application: "Gantt", component: "PlanGenerationAI", info: "" })
 */
function logFrontEndError(error = {}, generator = { application: '', component: '', info: '' }) {
    const payload = {
        application: generator.application || '',
        message: error.message || '',
        stack: error.stack || '',
        component: generator.component || '',
        info: generator.info || '',
        companyId: window.companyId || '',
        UserId: window.uid || '',
        UserName: window.UserName || '',
        strLanguage: window.strLanguage || '',
        url: window.location.href || '',
        apiBaseURL: window.apiBaseURL || '',
        date: new Date().toISOString()
    };

    fetch('https://tools.itmplatform.com:8081/logFrontendErrors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => response.json())
        .then(data => console.log('Frontend error logged:', JSON.stringify(data,2,null)))
        .catch((error) => console.error('Frontend logging error failed:', error));
}

export { logFrontEndError };
