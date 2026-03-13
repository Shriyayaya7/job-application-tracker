document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobForm');
    const saveBtn = document.getElementById('saveBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const success = document.getElementById('success');

    // Auto-fill form with data from current page
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        document.getElementById('jobUrl').value = currentTab.url;
        
        // Try to extract job information from the page
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            func: extractJobInfo
        }, (results) => {
            if (results && results[0] && results[0].result) {
                const jobInfo = results[0].result;
                document.getElementById('companyName').value = jobInfo.companyName || '';
                document.getElementById('jobTitle').value = jobInfo.jobTitle || '';
                document.getElementById('location').value = jobInfo.location || '';
                document.getElementById('jobDescription').value = jobInfo.description || '';
            }
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const jobData = {
            companyName: formData.get('companyName'),
            jobTitle: formData.get('jobTitle'),
            location: formData.get('location'),
            salary: formData.get('salary'),
            jobUrl: formData.get('jobUrl'),
            jobDescription: formData.get('jobDescription'),
            notes: formData.get('notes'),
            status: 'applied',
            applicationDate: new Date().toISOString()
        };

        // Validate required fields
        if (!jobData.companyName || !jobData.jobTitle) {
            showError('Company name and job title are required');
            return;
        }

        setLoading(true);
        hideError();
        hideSuccess();

        try {
            // Get auth token from storage
            const result = await chrome.storage.local.get(['authToken']);
            const token = result.authToken;

            if (!token) {
                showError('Please login to the Job Application Tracker first');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess();
                form.reset();
                setTimeout(() => {
                    window.close();
                }, 2000);
            } else {
                showError(data.message || 'Failed to save job');
            }
        } catch (err) {
            showError('Network error. Please make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    });
});

function extractJobInfo() {
    // Try to extract job information from common job board patterns
    const jobInfo = {
        companyName: '',
        jobTitle: '',
        location: '',
        description: ''
    };

    // Common selectors for job information
    const selectors = {
        jobTitle: [
            'h1',
            '.job-title',
            '[data-test="job-title"]',
            '.jobtitle',
            '.title'
        ],
        companyName: [
            '.company-name',
            '[data-test="company-name"]',
            '.company',
            '.employer'
        ],
        location: [
            '.location',
            '[data-test="location"]',
            '.job-location',
            '.location-text'
        ],
        description: [
            '.job-description',
            '[data-test="job-description"]',
            '.description',
            '.job-details'
        ]
    };

    // Extract job title
    for (const selector of selectors.jobTitle) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            jobInfo.jobTitle = element.textContent.trim();
            break;
        }
    }

    // Extract company name
    for (const selector of selectors.companyName) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            jobInfo.companyName = element.textContent.trim();
            break;
        }
    }

    // Extract location
    for (const selector of selectors.location) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            jobInfo.location = element.textContent.trim();
            break;
        }
    }

    // Extract description
    for (const selector of selectors.description) {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
            jobInfo.description = element.textContent.trim().substring(0, 1000); // Limit length
            break;
        }
    }

    // Try to get from page title as fallback
    if (!jobInfo.jobTitle && document.title) {
        const titleParts = document.title.split(' - ');
        if (titleParts.length > 0) {
            jobInfo.jobTitle = titleParts[0].trim();
        }
        if (titleParts.length > 1 && !jobInfo.companyName) {
            jobInfo.companyName = titleParts[1].trim();
        }
    }

    return jobInfo;
}

function setLoading(isLoading) {
    const loading = document.getElementById('loading');
    const saveBtn = document.getElementById('saveBtn');
    
    if (isLoading) {
        loading.style.display = 'flex';
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    } else {
        loading.style.display = 'none';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Job Application';
    }
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}

function hideError() {
    const error = document.getElementById('error');
    error.style.display = 'none';
}

function showSuccess() {
    const success = document.getElementById('success');
    success.style.display = 'block';
}

function hideSuccess() {
    const success = document.getElementById('success');
    success.style.display = 'none';
}
