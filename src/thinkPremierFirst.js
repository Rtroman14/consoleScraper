let contacts = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getText = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).innerText;
    }

    return "";
};

const getHref = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).href;
    }

    return "";
};

let contactList = document.querySelectorAll("#ctl00_tdBodyCenter > table > tbody > tr");

for (contactDiv of contactList) {
    let contact = {};

    contact.name = getText(contactDiv, "h2.locNameH2").replace("PGI - ", "");
    contact.address = getText(contactDiv, "div[itemprop='address']").split("\n").join(" ");
    contact.phone = getText(contactDiv, "td[itemprop='telephone']");

    contacts.push(contact);
}

// exportFile(contacts, "Northwestern Mutual Contacts.json");
