/**
 * Creates a promise to track resource loading
 * @param {HTMLElement} element - The element to track loading for
 * @returns {Promise} Promise that resolves when the element loads
 */
function createLoadPromise(element) {
    return new Promise((resolve, reject) => {
        element.onload = () => resolve(element);
        element.onerror = (error) => reject(new Error(`Failed to load ${element.src || element.href}: ${error}`));
    });
}

/**
 * Loads editor resources (CSS and JavaScript) based on environment
 * @returns {Promise<Object>} Result of the loading operation
 */
async function loadEditorResources() {
    try {
        // Determine domain based on URL parameter
        const domain = (window.location.search || '').includes('copilot-prod') 
            ? 'copilot.adobedemo.com' 
            : 'copilot-stage.adobedemo.com';

        // Remove existing elements if they exist
        const existingCss = document.getElementById('copilot-editor-css');
        const existingScript = document.getElementById('copilot-editor-script');
        if (existingCss) existingCss.remove();
        if (existingScript) existingScript.remove();

        // Create and load CSS
        const link = document.createElement('link');
        link.id = 'copilot-editor-css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `https://${domain}/editor/editor.css`;
        link.media = 'all';
        
        // Create and load JavaScript
        const script = document.createElement('script');
        script.id = 'copilot-editor-script';
        script.type = 'module';
        script.src = `https://${domain}/editor/editor.js`;

        // Create loading promises
        const cssPromise = createLoadPromise(link);
        const scriptPromise = createLoadPromise(script);

        // Append elements
        document.head.appendChild(link);
        document.body.appendChild(script);

        // Wait for both resources to load
        await Promise.all([cssPromise, scriptPromise]);

        // Verify the elements are properly loaded
        const cssLoaded = document.getElementById('copilot-editor-css');
        const scriptLoaded = document.getElementById('copilot-editor-script');

        if (!cssLoaded || !scriptLoaded) {
            throw new Error('Resources were not properly injected into the document');
        }

        // Dispatch success event
        window.dispatchEvent(new CustomEvent('copilotEditorLoaded', {
            detail: {
                domain,
                cssLoaded: true,
                scriptLoaded: true
            }
        }));

        return {
            success: true,
            domain,
            message: 'Editor resources loaded successfully'
        };

    } catch (error) {
        // Log error for debugging
        console.error('Failed to load editor resources:', error);

        // Dispatch error event
        window.dispatchEvent(new CustomEvent('copilotEditorError', {
            detail: {
                error: error.message,
                domain
            }
        }));

        // Clean up any partially loaded resources
        const failedCss = document.getElementById('copilot-editor-css');
        const failedScript = document.getElementById('copilot-editor-script');
        if (failedCss) failedCss.remove();
        if (failedScript) failedScript.remove();

        return {
            success: false,
            error: error.message,
            message: 'Failed to load editor resources'
        };
    }
}

export default loadEditorResources;