import axios from 'axios';

// Define the `checkSonarStatus` function
export async function checkSonarStatus() {
    console.log("checkSonarStatus function is being called"); // Confirm function is being called
    const sonarUrl = `${process.env.SONAR_API_URL}?projectKey=${process.env.SONAR_PROJECT_KEY}`;

    try {
        console.log("Preparing to send request to SonarQube API...");

        const response = await axios.get(sonarUrl, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.SONAR_AUTH_TOKEN}:`).toString('base64')}`
            },
            timeout: 10000 // Timeout to avoid indefinite hanging
        });

        console.log("Received response from SonarQube API"); // Confirm response received

        if (response.data && response.data.projectStatus) {
            console.log("SonarQube Project Status Response:", response.data.projectStatus);
            return response.data.projectStatus.status;
        } else {
            console.log("Project Status not found in response:", response.data);
            throw new Error("projectStatus is missing from the API response");
        }

    } catch (error) {
        console.error("Failed to retrieve SonarQube status:", error.message);
        throw error;
    }
}

checkSonarStatus()
    .then(status => console.log("Check Sonar Status completed with status:", status))
    .catch(error => console.error("Error in checkSonarStatus:", error.message));