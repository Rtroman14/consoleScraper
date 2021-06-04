let contacts = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getText = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).innerText;
    }

    return "";
};

for (let page = 1; page < 12; page++) {
    await delay(3000);

    let contactList = document.querySelectorAll(".nmx-search-rep-card");

    for (contactDiv of contactList) {
        let contact = {};

        let phoneNumbers = contactDiv.querySelectorAll(".fr-phone");

        let phone = 1;

        for (let phoneNumber of phoneNumbers) {
            contact[`Phone Number_${phone}`] = getText(phoneNumber, ".fr-phone > span");

            phone++;
        }

        contact.name = getText(contactDiv, ".fr-name > span");

        contact.title = getText(contactDiv, ".fr-title");
        contact.address = getText(contactDiv, ".fr-address");

        contacts.push(contact);
    }

    page === 11 && exportFile(contacts, "Northwestern Mutual.json");

    // next page
    document.querySelector(".nm-paging--next").click();
}
