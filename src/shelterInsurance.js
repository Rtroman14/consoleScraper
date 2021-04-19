const exportFile = (data, filename) => {
    if (!data) {
        console.error("Console.save: No data");
        return;
    }

    if (!filename) {
        filename = "console.json";
    }

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }

    var blob = new Blob([data], { type: "text/json" }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    );
    a.dispatchEvent(e);
};

// exportFile(data, "filename.json");

let contacts = [];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getText = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).innerText;
    }

    return "";
};

// for (let page = 1; page < 6; page++) {
// if (page !== 1) {
//     window.location = `https://www.shelterinsurance.com/CA/agent/search/?Page=${page}.0`;
// }

// await delay(3000);

let contactList = document.querySelectorAll(".agentResults > div");

for (contactDiv of contactList) {
    let contact = {};

    let nameArray = getText(contactDiv, ".agentName > a");
    let street = getText(contactDiv, ".agentName ~ .three.columns");

    contact.name = nameArray.split(" ").slice(1).join(" ");
    contact.email =
        contact.name[0] + contact.name.split(" ").slice(1).join("") + "@ShelterInsurance.com";
    contact.phone = getText(contactDiv, ".three.columns > a[role='button']");
    contact.address = street.split("\n").slice(2).join(" ").trim();

    contacts.push(contact);
}

exportFile(contacts, "ShelterInsurance Contacts.json");
// }
