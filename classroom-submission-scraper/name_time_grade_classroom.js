/**
 * Google Classroom Assignment Submission Scraper v1.1.1
 * Documentation: https://github.com/glenkusuma/script/tree/main/classroom-submission-scraper#readme
 * Created by github.com/glenkusuma
 */

// Constants for time delay and loop limit
const TIME_DELAY = 1000; // 1 second
const LOOP_LIMIT = 30;

/**
 * Scrapes Google Classroom assignment data including name, time, grade, and attached file names.
 * @returns {Promise<Array>} Promise that resolves with an array of assignment data objects.
 */
function ScrapeGrade() {
  return new Promise((resolve) => {
    let loopCount = 0;

    // Create an array to store assignment data
    const dataArray = [];

    /**
     * Clicks the "Next" button with a specified time delay.
     * @returns {boolean} True if the button was clicked; false if the button is disabled.
     */
    function clickNextButton() {
      // Select the "Next" button element with the specified jsname attribute
      const nextButton = document.querySelector('div[jsname="KwmAGc"]');

      // Check if the button element exists
      if (!nextButton) {
        console.log("Button element not found with the specified jsname attribute.");
        return false;
      }

      // Check the aria-disabled attribute
      const ariaDisabled = nextButton.getAttribute('aria-disabled');

      if (ariaDisabled == "true") {
        console.log("Button is disabled. Exiting the loop.");
        return false; // Return false to signal that the button is disabled
      }

      // Add the specified time delay before clicking the button
      setTimeout(() => { nextButton.click(); }, TIME_DELAY);
      return true;
    }

    /**
     * Retrieves the names of attached files sorted by extension.
     * @returns {string} A string containing attached file names separated by '||'.
     */
    function getAttachedFileNames() {
      // Select the parent div element for file attachments
      const attachmentParentDiv = document.querySelector('div[jsname="XkqTFd"]');

      // Check if the attachment parent div element exists
      if (!attachmentParentDiv) {
        console.log("Attachment parent div not found with the specified jsname.");
        return "";
      }

      // Select all elements with the class "LYKue" within the parent div
      const fileElements = attachmentParentDiv.querySelectorAll('.LYKue');

      // Create an array to store file names
      const fileNamesArray = [];

      // Loop through the file elements and extract the file names
      fileElements.forEach((fileElement) => {
        const fileName = fileElement.textContent;
        fileNamesArray.push(fileName);
      });

      // Sort the unique file names by extension
      fileNamesArray.sort((a, b) => {
        const extA = a.split(': ')[0].toLowerCase();
        const extB = b.split(': ')[0].toLowerCase();
        return extA.localeCompare(extB);
      });

      // Join the sorted file names with '||'
      return fileNamesArray.join('||');
    }

    /**
     * Retrieves the profile image of the student.
     * @returns {string} The profile image of the student.
     */
    function getProfileImage() {
      const nameParentDiv = document.querySelector('div.A39x1.ScX2If.LMgvRb.KKjvXb[jsname="wQNmvb"]');

      // Check if the name parent div element exists
      if (!nameParentDiv) {
        console.log("Parent div for the name not found with the specified class and jsname.");
        return "";
      }

      const imgDiv = nameParentDiv.querySelector('img.sIXQKb.c4pfme.eBPtzb.BTx1Ob');

      if (!imgDiv) {
        console.log("Image div not found within the parent div.");
        return "";
      }

      return `=IMAGE("` + imgDiv.src + `")`;
    }

    /**
     * Retrieves the name of the student.
     * @returns {string} The name of the student.
     */
    function getName() {
      // Select the parent div element for the name
      const nameParentDiv = document.querySelector('div.A39x1.ScX2If.LMgvRb.KKjvXb[jsname="wQNmvb"]');

      // Check if the name parent div element exists
      if (!nameParentDiv) {
        console.log("Parent div for the name not found with the specified class and jsname.");
        return "";
      }

      // Find the child div with class "UvCNFb" and get its text content (the name)
      const nameDiv = nameParentDiv.querySelector('div.UvCNFb.dE51Ic');

      if (!nameDiv) {
        console.log("Name div not found within the parent div.");
        return "";
      }

      return nameDiv.textContent;
    }

    /**
     * Retrieves the assignment submission time.
     * @returns {string} The assignment submission time.
     */
    function getTime() {
      // Select the element with the specified jscontroller attribute for time
      const timeElement = document.querySelector('[jscontroller="WPsbnb"]');

      // Check if the timeElement exists
      if (!timeElement) {
        console.log("Element not found with the specified jscontroller attribute for time.");
        return "";
      }

      // Get the text content of the timeElement
      const text = timeElement.textContent;

      // Split the text by "Turned in on" to separate the date and time
      const parts = text.split('Turned in on');

      if (parts.length >= 2) {
        // The date and time are in parts[1]. Trim any extra spaces.
        return parts[1].trim();
      } else {
        return 'Missing';
      }
    }

    /**
     * Retrieves the assignment grade.
     * @returns {string} The assignment grade.
     */
    function getGrade() {
      const gradeElement = document.querySelector('input[jsname="YPqjbf"]');

      // Check if the input element exists
      if (gradeElement) {
        return gradeElement.getAttribute('data-initial-value');
      } else {
        console.log("Grade element not found.");
        return "";
      }
    }

    // Continue scraping and clicking until the button is disabled or the loop count reaches the specified limit
    let continueScraping = true;
    function scrapeAndClick() {
      if (continueScraping && loopCount < LOOP_LIMIT) {
        loopCount++;

        // Create an object to store the assignment data
        const data = {
          Name: getName(),
          ProfileImage: getProfileImage(),
          Time: getTime(),
          Grade: getGrade(),
          AttachedFileNames: getAttachedFileNames(),
        };

        // Log all the data
        console.log("Name:", data.Name);
        console.log("Time:", data.Time);
        console.log("Grade:", data.Grade);
        console.log("Attached File Names:", data.AttachedFileNames);

        // Save all data in the array
        dataArray.push(data);

        // Click the next button and check if it's disabled
        continueScraping = clickNextButton();

        // Continue scraping and clicking after the delay
        setTimeout(scrapeAndClick, TIME_DELAY);
      } else {
        console.log("Loop:", loopCount, "has been executed.");
        resolve(dataArray);
      } // Resolve the promise with the data array
    }

    // Call the function to start scraping and clicking
    scrapeAndClick();
  });
}

/**
 * Converts an array of objects to a CSV string with dynamic headers based on file formats.
 * @param {Array} dataArray - An array of objects.
 * @returns {string} A CSV string representation of the data with dynamic headers.
 */
function convertToCSV(dataArray) {
  if (dataArray.length === 0) {
    console.log("Data Array is empty. Cannot generate CSV.");
    return "";
  }

  // Extract all unique file formats from the dataArray
  const uniqueFileFormats = new Set();
  dataArray.forEach(item => {
    const fileNames = item.AttachedFileNames.split('||');
    fileNames.forEach(fileName => {
      const format = fileName.split(': ')[0].toLowerCase();
      if (format) {
        uniqueFileFormats.add(format);
      }
    });
  });

  // Sort the unique file formats alphabetically
  const sortedFormats = Array.from(uniqueFileFormats).sort();

  // Create the header row with dynamic headers
  const headers = ['Name', 'ProfileImage', 'Time', 'Grade', ...sortedFormats];

  // Create a mapping of file formats to their respective columns
  const formatToColumn = {};
  sortedFormats.forEach((format, index) => {
    formatToColumn[format] = index + 4; // Add 4 to account for the standard columns
  });

  // Generate the CSV content with dynamic headers
  const csvRows = dataArray.map(item => {
    const rowData = headers.map(header => {
      if (header === 'Name') return item.Name;
      if (header === 'ProfileImage') return item.ProfileImage;
      if (header === 'Time') return item.Time;
      if (header === 'Grade') return item.Grade;

      // For file format columns
      const format = header.toLowerCase();
      const fileNames = item.AttachedFileNames.split('||');
      const filesWithFormat = fileNames
        .filter(fileName => fileName.toLowerCase().startsWith(format))
        .map(fileName => fileName.split(': ')[1])
        .join('||');
      return filesWithFormat || ''; // Return the file names or an empty string
    });

    return rowData.join(';');
  });

  const csvContent = [headers.join(';')].concat(csvRows).join('\n');
  return csvContent;
}

// Call the function and use the returned Promise to access the data
ScrapeGrade()
  .then(dataArray => {
    console.log("Data Array:", dataArray);

    // Call the function to convert the dataArray to a CSV string
    const csvData = convertToCSV(dataArray);

    // Log or use the csvData as needed
    console.log(csvData);
  });
