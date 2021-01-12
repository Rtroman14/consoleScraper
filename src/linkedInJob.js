allJobs = [];

const jobWindow = document.querySelector("section.jobs-search__left-rail > div > div");

const scroll = async (jobWindow) => {
    jobWindow.scrollBy({
        top: jobWindow.scrollHeight,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    jobWindow.scrollBy({
        top: -jobWindow.scrollHeight / 2,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    jobWindow.scrollBy({
        top: jobWindow.scrollHeight * 0.75,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
};

const numPages = document.querySelector(".artdeco-pagination__pages > li:last-child").innerText;

for (let page = 1; page < numPages; page++) {
    const jobListing = {};

    await scroll(jobWindow);

    const jobListings = document.querySelectorAll("ul.jobs-search-results__list > li");

    for (let job of jobListings) {
        jobListing.position = job.querySelector("a.job-card-list__title").innerText;
        jobListing.positionLink = job.querySelector("a.job-card-list__title").href;
        jobListing.company = job.querySelector("a.job-card-container__company-name").innerText;
        jobListing.companyLink = job.querySelector("a.job-card-container__company-name").href;
        jobListing.location = job.querySelector(
            "ul.job-card-container__metadata-wrapper > li.job-card-container__metadata-item"
        ).innerText;
        jobListing.time = job.querySelector("time").datetime;

        allJobs.push(jobListing);
    }
}
