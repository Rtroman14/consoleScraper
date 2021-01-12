const jobWindow = document.querySelector(".jobs-search-results");

const scroll = async (inboxWindow) => {
    inboxWindow.scrollBy({
        top: inboxWindow.scrollHeight,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    inboxWindow.scrollBy({
        top: -inboxWindow.scrollHeight / 2,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    inboxWindow.scrollBy({
        top: inboxWindow.scrollHeight * 0.75,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
};
