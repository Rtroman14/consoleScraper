const inboxWindow = document.querySelector("ul.msg-conversations-container__conversations-list");

const client = document.querySelector(".global-nav__primary-link > img").alt;

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

let previousHeight = 0;
let currentHeight = inboxWindow.scrollHeight;
let thisYear = true;

while (previousHeight < currentHeight && thisYear) {
    previousHeight = inboxWindow.scrollHeight;
    await scroll(inboxWindow);

    const inboxes = document.querySelectorAll(
        ".msg-conversations-container__conversations-list > li.msg-conversation-listitem > div"
    );

    let allDates = [];

    for (let inbox of inboxes) {
        let date = inbox.querySelector("time.msg-conversation-card__time-stamp").innerText;

        allDates.push(date);
    }

    let dates = allDates.join(" ").split(" ");

    if (dates.includes("2019") || dates.includes("2018")) {
        thisYear = false;
    } else {
        currentHeight = inboxWindow.scrollHeight;
    }
}

console.log("Done");

const inboxes = document.querySelectorAll(
    ".msg-conversations-container__conversations-list > li.msg-conversation-listitem > div"
);

let allInboxes = [];

for (let inbox of inboxes) {
    eachInbox = {};
    let contact = inbox.querySelector("h3.msg-conversation-listitem__participant-names").innerText;
    let date = inbox.querySelector("time.msg-conversation-card__time-stamp").innerText;
    let message = inbox.querySelector("p.msg-conversation-card__message-snippet").innerText;
    let responder = message.split(" ").slice(0, 2).join(" "); // incase first name === two names

    // If date === time, change to today's date
    if (date.includes(":")) {
        date = new Date().toLocaleDateString().slice(0, -5);
    }

    // Act if responder isn't you && not an ad
    if (!responder.includes("You") && responder.includes(":")) {
        eachInbox.contact = contact;
        eachInbox.message = message;
        eachInbox.date = date;
        allInboxes.push(eachInbox);
    }
}

exportFile(allInboxes, `${client}'s Inbox`);
