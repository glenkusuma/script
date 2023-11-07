# Google Classroom Assignment Submission Scraper v1.1

This JavaScript script allows you to scrape and extract student name, submission time, and grades from Google Classroom. It automates the process of navigating through assignments and collects relevant data. The scraped data can be saved as a CSV file for further analysis.
You have the option to use either the full script [`name_time_grade_classroom.js`](./name_time_grade_classroom.js) or the minified version [`gcr-scraper-min.js`](./gcr-scraper-min.js). The minified version is provided for convenience and results in a smaller script size, which can be beneficial for certain use cases.

## Prerequisites

- Access to Google Classroom.
- A web browser (Google Chrome recommended).

## Using the Full Script

Follow these steps to use the full script:

1. Log in to your Google Classroom account using a web browser.

2. Navigate to the assignment's student works' page. You can do this by opening a URL in the following format:
   `https://classroom.google.com/c/{courseId}/a/{assignmentId}/submissions/by-status/and-sort-first-name/all`

3. Open the browser's developer console:
   - Google Chrome: Press `Ctrl+Shift+J` or `Cmd+Option+J` (on Mac).
   - Mozilla Firefox: Press `Ctrl+Shift+K` or `Cmd+Option+K` (on Mac).
   - Microsoft Edge: Press `Ctrl+Shift+J` or `Cmd+Option+J` (on Mac).

4. Copy and paste the following code into the console and press `Enter`. This code will redirect you to the appropriate assignment grading detail page:

```javascript
// Get the current URL
const currentURL = window.location.href;

// Split the current URL by '/'
const parts = currentURL.split('/');

// Extract the relevant parts
const courseId = parts[4];
const assignmentId = parts[6];

// Construct the new URL
const newURL = `https://classroom.google.com/g/tg/${courseId}/${assignmentId}`;

// Redirect to the new URL
window.location.href = newURL;
```
5. Copy and paste the entire contents of [`name_time_grade_classroom.js`](./name_time_grade_classroom.js) into the console.

6. Press `Enter` to run the script. It will start collecting data and clicking the "Next" button until the button is disabled or the loop limit is reached.

7. The data will be displayed in the console, and a CSV representation will be generated and printed to the console as well.

## Using the Minified Version

To use the minified version of the script [`gcr-scraper-min.js`](./gcr-scraper-min.js), follow the same steps as above but copy and paste the minified script into the console instead of the full script.

## Customization

You can customize the `TIME_DELAY` and `LOOP_LIMIT` constants at the beginning of the script. The `TIME_DELAY` sets the time delay (in milliseconds) between clicking "Next" buttons, and the `LOOP_LIMIT` sets the maximum number of iterations.

## Data Output

The data collected will include:

- Student name
- Profile image
- Submission time
- Grade
- File Attachments

The data will be displayed in the console and formatted as a CSV string.

## Saving Data

To save the scraped data as a CSV file, you can:

1. Copy the CSV data from the console and paste it into a text file. Save the file with a `.csv` extension.
2. Manually copy the data from the console to a spreadsheet application (e.g., Microsoft Excel, Google Sheets) and save it as a CSV file.

## Disclaimer

This script is for educational and informational purposes only. It should be used responsibly and in accordance with Google's terms of service. Scraping data from websites may be subject to legal and ethical considerations.

## Author

This Script is created with ❤️ by [Glen Kusuma](https://github.com/glenkusuma).

## License

This script is provided as-is and is open for personal and educational use. The author assumes no responsibility for its misuse.

---

Please be aware that scraping data from websites may be against the terms of service of the website. Always ensure you have the necessary permissions to scrape data, and use this script responsibly and ethically.
