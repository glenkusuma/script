/**
 * Google Classroom Assignment Submission Scraper v1.1.0
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
     * @returns {string} A string containing attached file names separated by ';'.
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

      // Sort the file names by extension
      fileNamesArray.sort((a, b) => {
        const extA = a.split('.').pop();
        const extB = b.split('.').pop();
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
 * Converts an array of objects to a CSV string.
 * @param {Array} dataArray - An array of objects.
 * @returns {string} A CSV string representation of the data.
 */
function convertToCSV(dataArray) {
  if (dataArray.length === 0) {
    console.log("Data Array is empty. Cannot generate CSV.");
    return "";
  }

  const headers = Object.keys(dataArray[0]);
  const csvContent = [headers.join(';')].concat(dataArray.map(item => headers.map(key => item[key]).join(';'))).join('\n');
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
