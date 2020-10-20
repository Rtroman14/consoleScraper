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

const d = new Date();
const month = d.getMonth();

const monthArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const lastMonth = monthArray[month - 1];

let previousHeight = 0;
let currentHeight = inboxWindow.scrollHeight;
let isLastMonth = true;

while (previousHeight < currentHeight && isLastMonth) {
    previousHeight = inboxWindow.scrollHeight;
    await scroll(inboxWindow);

    const inboxes = document.querySelectorAll(
        ".msg-conversations-container__conversations-list > li.msg-conversation-listitem > div"
    );

    // let allDates = [];

    for (let inbox of inboxes) {
        let date = inbox.querySelector("time.msg-conversation-card__time-stamp").innerText;

        if (date.includes(lastMonth)) {
            isLastMonth = false;
        }

        // allDates.push(date);
    }

    // let dates = allDates.join(" ").split(" ");

    // if (dates.includes(lastMonth) || dates.includes(lastMonth)) {
    //     isLastMonth = false;
    // } else {
    currentHeight = inboxWindow.scrollHeight;
    // }
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

// exportFile(allInboxes, `${client}'s Inbox`);

// console.log("Sep 14".includes(lastMonth));
