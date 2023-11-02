/** 
 * Google Classroom Assignment Submission Scraper v1.0
 * Documentation : https://github.com/glenkusuma/script/tree/main/classroom-submission-scraper#readme
 * Created by github.com/glenkusuma
 */

// Constants for time delay and loop limit
const TIME_DELAY = 1000; // 1 second
const LOOP_LIMIT = 30;

function ScrapeGrade() {
  return new Promise((resolve) => {
    let loopCount = 0;

    // Create an array to store name and time data
    const dataArray = [];

    // Create a function to click the next button with a time delay
    function clickNextButton() {
      // Select the button element with the specified jsname attribute
      const nextButton = document.querySelector('div[jsname="KwmAGc"]');

      // Check if the button element exists
      if (nextButton) {
        // Check the aria-disabled attribute
        const ariaDisabled = nextButton.getAttribute('aria-disabled');

        if (ariaDisabled !== "true") {
          // Add the specified time delay before clicking the button
          setTimeout(() => {
            nextButton.click();
          }, TIME_DELAY);
        } else {
          console.log("Button is disabled. Exiting the loop.");
          resolve(dataArray); // Resolve the promise with the data array
          return false; // Return false to signal that the button is disabled
        }
      } else {
        console.log("Button element not found with the specified jsname attribute.");
      }
      return true;
    }

    // Continue scraping and clicking until the button is disabled or the loop count reaches the specified limit
    let continueScraping = true;
    function scrapeAndClick() {
      if (continueScraping && loopCount < LOOP_LIMIT) {
        loopCount++;

        // Create an object to store the name, time, and grade data
        const data = {};

        // Select the parent div element for the name
        const nameParentDiv = document.querySelector('div.A39x1.ScX2If.LMgvRb.KKjvXb[jsname="wQNmvb"]');

        // Check if the name parent div element exists
        if (nameParentDiv) {
          // Find the child div with class "UvCNFb" and get its text content (the name)
          const nameDiv = nameParentDiv.querySelector('div.UvCNFb.dE51Ic');
          if (nameDiv) {
            data.name = nameDiv.textContent;
          } else {
            console.log("Name div not found within the parent div.");
          }
        } else {
          console.log("Parent div for the name not found with the specified class and jsname.");
        }

        // Select the element with the specified jscontroller attribute for time
        const timeElement = document.querySelector('[jscontroller="WPsbnb"]');

        // Check if the timeElement exists
        if (timeElement) {
          // Get the text content of the timeElement
          const text = timeElement.textContent;

          // Split the text by "Turned in on" to separate the date and time
          const parts = text.split('Turned in on');

          if (parts.length >= 2) {
            // The date and time are in parts[1]. Trim any extra spaces.
            data.time = parts[1].trim();
          } else {
            console.log("Date and time not found in the element.");
          }
        } else {
          console.log("Element not found with the specified jscontroller attribute for time.");
        }

        const gradeElement = document.querySelector('input[jsname="YPqjbf"]');

        // Check if the input element exists
        if (gradeElement) {
          data.grade = gradeElement.getAttribute('data-initial-value');
        } else {
          console.log("Grade element not found.");
        }

        // Save the name, time, and grade data in the array
        if (data.name && data.time && data.grade) {
          console.log("Name:", data.name);
          console.log("Time:", data.time);
          console.log("Grade:", data.grade);

          dataArray.push(data);
        } else {
          console.log("Name, time, or grade data not available.");
        }

        // Click the next button and check if it's disabled
        continueScraping = clickNextButton();

        // Continue scraping and clicking after the delay
        setTimeout(scrapeAndClick, TIME_DELAY);
      }
    }

    // Call the function to start scraping and clicking
    scrapeAndClick();
  });
}

// Function to convert dataArray to CSV
function convertToCSV(dataArray) {
  if (dataArray.length === 0) {
    console.log("Data Array is empty. Cannot generate CSV.");
    return;
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
