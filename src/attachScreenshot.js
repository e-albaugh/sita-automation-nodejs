import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

export async function attachScreenshot(lwSSOCookieValue) {
    const screenshotPath = './screenshots/sonarqube_screenshot.png';
    const uri = `${process.env.VALUEEDGE_API_URL}/attachments`;

    // Step 1: Check if the file exists
    if (!fs.existsSync(screenshotPath)) {
        console.error("Screenshot file not found:", screenshotPath);
        throw new Error("Screenshot file not found");
    }

    // Step 2: Set up form-data
    const form = new FormData();
    form.append('entity', JSON.stringify({
        owner_process: { id: process.env.VALUEEDGE_QUALITY_GATE_ID, type: "process" },
        name: `sonarqube_screenshot_for_process_${process.env.VALUEEDGE_RELEASE_PROCESS_ID}`,
        description: "This is a SonarQube screenshot for audit purposes"
    }));
    form.append('content', fs.createReadStream(screenshotPath), {
        filename: 'sonarqube_screenshot.png',
        contentType: 'image/png'
    });

    // Step 3: Set up headers and send request
    try {
        const response = await axios.post(uri, form, {
            headers: {
                ...form.getHeaders(), // Includes boundary for form-data
                'LWSSO_COOKIE_KEY': lwSSOCookieValue,
                'Content-Type': 'multipart/form-data',// Pass cookie as expected by the server
                'ALM_OCTANE_TECH_PREVIEW': 'true'
            }
        });

        console.log("Screenshot attached successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error attaching screenshot:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }
        throw error;
    }
}