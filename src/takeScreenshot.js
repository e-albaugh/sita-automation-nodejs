import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to `__filename` and `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function takeScreenshot() {
    // Set up the URL to SonarQube's project dashboard using the project key
    const sonarUrl = `${process.env.SONAR_UI_URL}/dashboard?id=${process.env.SONAR_PROJECT_KEY}`;

    try {
        console.log("Launching Puppeteer...");

        // Launch the browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        console.log(`Navigating to SonarQube URL: ${sonarUrl}`);
        
        // Go to the SonarQube URL
        await page.goto(sonarUrl, { waitUntil: 'networkidle2' });

        console.log("Taking screenshot...");

        // Define the path for the screenshot file
        const screenshotPath = path.resolve(__dirname, '../screenshots/sonarqube_screenshot.png');
        
        // Take the screenshot and save it
        await page.screenshot({ path: screenshotPath });
        
        console.log(`Screenshot saved at ${screenshotPath}`);

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error("Error taking screenshot:", error.message);
        throw error;
    }
}

console.log("Reached the direct execution check.");


takeScreenshot()
    .then(() => console.log("Screenshot taken successfully"))
    .catch(error => console.error("Error in takeScreenshot:", error.message));

