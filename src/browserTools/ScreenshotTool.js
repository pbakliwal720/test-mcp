/**
 * Handles browser screenshot functionality
 */
class ScreenshotTool {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }

    /**
     * Initialize screenshot tool
     */
    async initialize() {
        // No initialization needed for now
    }

    /**
     * Capture screenshot of the current viewport
     * @returns {Promise<string>} Base64 encoded screenshot
     */
    async capture() {
        try {
            // Set canvas dimensions to viewport size
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            // Create a temporary image
            const image = new Image();
            
            // Convert viewport to blob using html2canvas if available
            if (window.html2canvas) {
                const canvas = await window.html2canvas(document.body);
                return canvas.toDataURL('image/png');
            }

            // Fallback to basic screenshot
            return await this._captureBasic();
        } catch (error) {
            console.error('Screenshot capture failed:', error);
            throw new Error('Failed to capture screenshot');
        }
    }

    /**
     * Basic screenshot capture using browser API
     * @returns {Promise<string>} Base64 encoded screenshot
     */
    async _captureBasic() {
        if (!window.navigator.mediaDevices) {
            throw new Error('Screenshot API not supported');
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                preferCurrentTab: true
            });

            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();

            // Draw the captured frame to canvas
            this.context.drawImage(bitmap, 0, 0);

            // Stop the screen capture
            track.stop();

            // Convert to base64
            return this.canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Basic screenshot capture failed:', error);
            throw error;
        }
    }

    /**
     * Capture a specific element
     * @param {Element} element - Element to capture
     * @returns {Promise<string>} Base64 encoded screenshot
     */
    async captureElement(element) {
        try {
            if (window.html2canvas) {
                const canvas = await window.html2canvas(element);
                return canvas.toDataURL('image/png');
            }

            // Fallback to element bounds capture
            const rect = element.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;

            // Create a temporary image from element
            const image = new Image();
            image.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">' + element.outerHTML + '</div></foreignObject></svg>')}`;

            // Draw the image to canvas
            await new Promise(resolve => {
                image.onload = () => {
                    this.context.drawImage(image, 0, 0);
                    resolve();
                };
            });

            return this.canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Element screenshot capture failed:', error);
            throw new Error('Failed to capture element screenshot');
        }
    }

    /**
     * Download screenshot
     * @param {string} dataUrl - Base64 encoded image
     * @param {string} filename - Output filename
     */
    download(dataUrl, filename = 'screenshot.png') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.click();
    }
}

export default ScreenshotTool;