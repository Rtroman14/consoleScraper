let contacts = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getText = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).innerText;
    }

    return "";
};

for (let page = 1; page < 23; page++) {
    if (page !== 1) {
        window.location = `https://agents.metlife.com/#search/location=80210&radius=50&view=list&sortBy=distance&page=${page}&searchType=by_location`;
    }

    await delay(8000);

    let contactList = document.querySelectorAll(
        "#search-result-list-template > div.search-result-list.col-md-12 > div > div"
    );

    for (contactDiv of contactList) {
        let contact = {};

        let street = [];
        let streetInfo = contactDiv.querySelectorAll(".agent-address-text");
        for (let st of streetInfo) {
            street.push(st.innerText);
        }

        contact.company = getText(contactDiv, ".agent-title");
        contact.street = street.join(" ");
        contact.phone = getText(contactDiv, ".phone-number");

        contacts.push(contact);
    }

    page === 22 && exportFile(contacts, "MetLife Contacts.json");
}
