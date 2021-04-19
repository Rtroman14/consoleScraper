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

for (let page = 1; page < 32; page++) {
    await delay(500);

    let contactList = document.querySelectorAll(".nmxo-agent-card");

    for (contactDiv of contactList) {
        let contact = {};

        let address = getText(contactDiv, "div.nmxo-agent-card--credentials > div:nth-child(3)");

        contact.name = getText(contactDiv, ".nmxo-agent-card--headline");
        contact.email = contact.name.split(" ").join(".") + "@nm.com";
        contact.location = address.split(" ").slice(1).join(" ");
        contact.website = getHref(contactDiv, ".nmxo-agent-card--website-link");

        contacts.push(contact);
    }

    page === 31 && exportFile(contacts, "Northwestern Mutual Contacts.json");

    document.querySelector("#btnNext").click();
}
