const inboxWindow = document.querySelector("ul.msg-conversations-container__conversations-list");

let scroll = async (inboxWindow) => {
    inboxWindow.scrollBy({
        top: 9999,
        behavior: "smooth",
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
};

let previousHeight = 0;
let currentHeight = inboxWindow.scrollHeight;
let total = 0;

while (previousHeight < currentHeight) {
    previousHeight = inboxWindow.scrollHeight;
    await scroll(inboxWindow);

    currentHeight = inboxWindow.scrollHeight;
}

console.log("Done");

const inboxes = document.querySelectorAll(
    ".msg-conversations-container__conversations-list > li.msg-conversation-listitem"
);

const client = document.querySelector(".global-nav__primary-link > img").alt;

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
