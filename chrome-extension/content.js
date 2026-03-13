// Content script for extracting job information from web pages
// This script runs on all pages and can be used to extract job information

console.log('Job Application Tracker content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'extractJobInfo') {
        const jobInfo = extractJobInfo();
        sendResponse(jobInfo);
    }
});

function extractJobInfo() {
    const jobInfo = {
        companyName: '',
        jobTitle: '',
        location: '',
        description: '',
        salary: ''
    };

    // LinkedIn
    if (window.location.hostname.includes('linkedin.com')) {
        jobInfo.jobTitle = document.querySelector('.top-card-layout__title')?.textContent?.trim() || '';
        jobInfo.companyName = document.querySelector('.topcard__org-name-link')?.textContent?.trim() || '';
        jobInfo.location = document.querySelector('.topcard__flavor-row')?.textContent?.trim() || '';
        jobInfo.description = document.querySelector('.show-more-less-html__markup')?.textContent?.trim() || '';
    }
    // Indeed
    else if (window.location.hostname.includes('indeed.com')) {
        jobInfo.jobTitle = document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent?.trim() || '';
        jobInfo.companyName = document.querySelector('.jobsearch-InlineCompanyRating-companyInfo')?.textContent?.trim() || '';
        jobInfo.location = document.querySelector('.jobsearch-JobInfoHeader-companyLocation')?.textContent?.trim() || '';
        jobInfo.description = document.querySelector('#jobDescriptionText')?.textContent?.trim() || '';
    }
    // Glassdoor
    else if (window.location.hostname.includes('glassdoor.com')) {
        jobInfo.jobTitle = document.querySelector('.css-17x2qwl')?.textContent?.trim() || '';
        jobInfo.companyName = document.querySelector('.css-17x2qwl + div')?.textContent?.trim() || '';
        jobInfo.location = document.querySelector('[data-test="location"]')?.textContent?.trim() || '';
        jobInfo.description = document.querySelector('.jobDescription')?.textContent?.trim() || '';
    }
    // Generic extraction
    else {
        // Try common selectors
        const titleSelectors = ['h1', '.job-title', '[data-test="job-title"]', '.jobtitle', '.title'];
        const companySelectors = ['.company-name', '[data-test="company-name"]', '.company', '.employer'];
        const locationSelectors = ['.location', '[data-test="location"]', '.job-location', '.location-text'];
        const descriptionSelectors = ['.job-description', '[data-test="job-description"]', '.description', '.job-details'];

        // Extract job title
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                jobInfo.jobTitle = element.textContent.trim();
                break;
            }
        }

        // Extract company name
        for (const selector of companySelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                jobInfo.companyName = element.textContent.trim();
                break;
            }
        }

        // Extract location
        for (const selector of locationSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                jobInfo.location = element.textContent.trim();
                break;
            }
        }

        // Extract description
        for (const selector of descriptionSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                jobInfo.description = element.textContent.trim().substring(0, 1000);
                break;
            }
        }

        // Fallback to page title
        if (!jobInfo.jobTitle && document.title) {
            const titleParts = document.title.split(' - ');
            if (titleParts.length > 0) {
                jobInfo.jobTitle = titleParts[0].trim();
            }
            if (titleParts.length > 1 && !jobInfo.companyName) {
                jobInfo.companyName = titleParts[1].trim();
            }
        }
    }

    return jobInfo;
}
