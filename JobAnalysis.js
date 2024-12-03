// Class representing a Job
class Job {
    constructor(jobNo, title, pageLink, posted, type, level, estimatedTime, skill, detail) {
        this.jobNo = jobNo;
        this.title = title;
        this.pageLink = pageLink;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.estimatedTime = estimatedTime;
        this.skill = skill;
        this.detail = detail;
    }
// Method to generate HTML string of job details
    getDetails() {
        return `
            <strong>Job No:</strong> ${this.jobNo}<br>
            <strong>Title:</strong> ${this.title}<br>
            <strong>Type:</strong> ${this.type}<br>
            <strong>Level:</strong> ${this.level}<br>
            <strong>Skill:</strong> ${this.skill}<br>
            <strong>Estimated Time:</strong> ${this.estimatedTime}<br>
            <strong>Description:</strong> ${this.detail}<br>
            <strong>Posted:</strong> ${this.posted}<br>
            <a href="${this.pageLink}" target="_blank">View Job Page</a>
        `;
    } 
     // Method to convert posted time in minutes
    getPostedTimeInMinutes() {
        const timeValue = parseInt(this.posted.split(" ")[0]);
        const unit = this.posted.split(" ")[1].toLowerCase();
        return unit.includes("minute") ? timeValue : timeValue * 60; // Convert hours to minutes
    }
}

// Array to store job objects
let jobs = [];

// Event listener for file input change
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
// Event listener for filter button click
document.getElementById('applyFilters').addEventListener('click', applyFilters);


// Function to handle file upload 
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                jobs = data.map(
                    job =>
                        new Job(
                            job["Job No"],
                            job.Title,
                            job["Job Page Link"],
                            job.Posted,
                            job.Type,
                            job.Level,
                            job["Estimated Time"],
                            job.Skill,
                            job.Detail
                        )
                );
                populateFilters();
                displayJobs(jobs);
                document.querySelector('.filters').style.display = 'flex';
            } catch (error) {
                alert('Error loading file. Please ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}


// Function to populate filter dropdowns with unique values
function populateFilters() {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateDropdown('levelFilter', levels);
    populateDropdown('typeFilter', types);
    populateDropdown('skillFilter', skills);
}

// Helper function to populate dropdown with values
function populateDropdown(filterId, values) {
    const filter = document.getElementById(filterId);
    filter.innerHTML = '<option value="All">All</option>';
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        filter.appendChild(option);
    });
}
// Function to apply filters and sort jobs
function applyFilters() {
    const levelFilter = document.getElementById('levelFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const skillFilter = document.getElementById('skillFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;

    let filteredJobs = jobs.filter(job => {
        return (
            (levelFilter === 'All' || job.level === levelFilter) &&
            (typeFilter === 'All' || job.type === typeFilter) &&
            (skillFilter === 'All' || job.skill === skillFilter)
        );
    });

    if (sortFilter.includes('Title')) {
        const direction = sortFilter.includes('A-Z') ? 1 : -1;
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title) * direction);
    } else if (sortFilter.includes('Posted Time')) {
        const direction = sortFilter.includes('Newest First') ? 1 : -1;
        filteredJobs.sort((a, b) => (a.getPostedTimeInMinutes() - b.getPostedTimeInMinutes()) * direction);
    }

    displayJobs(filteredJobs);
}

function displayJobs(jobList) {
    const jobListDiv = document.getElementById('jobList');
    const modal = document.getElementById('jobModal');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.close');

    // Clear previous job list
    jobListDiv.innerHTML = '';

    if (jobList.length === 0) {
        jobListDiv.textContent = 'No jobs available.';
        return;
    }

    // Create job list
    jobList.forEach(job => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'job';
        jobDiv.innerHTML = `
            <strong>${job.title}</strong> - ${job.level} (${job.type})
        `;

        // Add click event for each job
        jobDiv.addEventListener('click', () => {
            modalDetails.innerHTML = job.getDetails(); // Fill modal with job details
            modal.style.display = 'block'; // Show modal
        });

        jobListDiv.appendChild(jobDiv);
    });

    // Close modal event
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if clicked outside the modal content
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}



