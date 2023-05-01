This script I made to search for dead links in the markdown files within a project repository directory. 

To run the script, add the repository folder to the root of the dead-link-finder directory. 

Then, start the script by entering "npm start" on Terminal at the root of the dead-link-finder directory. 

After the script runs, you should a logged statement of "Call to linkCrawl took x milliseconds" where x is the time it took complete the axios get requests for each link within all markdown files in the repository directory. 

After the execution time message, you should see one of two possible logged statements: 1) "No dead links found. Great!" in the case of no dead links found in the markdown files or 2) an array of all dead links found in the project, which you can then search and begin fixing. 
