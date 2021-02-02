let allData = [];

let run = true;

let getText = async (doc, selector) => {
    if (doc.querySelector(selector)) {
        return await doc.querySelector(selector).innerText;
    }

    return "";
};

let getWebsite = async (selector) => {
    if (document.querySelector(selector)) {
        return await document.querySelector(selector).href;
    }

    return "";
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let pages = 0;

while (run) {
    await delay(4000);

    let contact = {};

    // pages++;

    contact.company = await getText(
        document,
        "div.col.col-md.py-1.d-flex.align-content-between.flex-column > h1"
    );
    contact.location = await getText(
        document,
        "div.d-flex.align-items-start.justify-content-between > div > div:nth-child(1) > small"
    );
    contact.phone = await getText(
        document,
        "a.telLink.badge.mb-2.badge-light.text-primary.p-0.mr-2 > span"
    );
    contact.alternatePhone = await getText(
        document,
        "div.card-body.p-0 > div > div.col-md > a:nth-child(5) > span"
    );
    contact.address = await getText(
        document,
        "body > section:nth-child(4) > div > div > div > div.card-body.p-0 > div > div.col-md > div"
    );
    contact.website = await getWebsite("a.badge.badge-light.text-primary.p-0.mr-2.mb-2.extTrk");

    // // KEY CONTACTS
    let keyContactTitle = await getText(document, "#keyContactSection > h4");
    contact.test = keyContactTitle;

    // document.querySelector("#keyContactSection > h4").innerText;

    // if (keyContactTitle === "Owners, Principals & Senior Executives") {
    //     console.log("TRUEEE");
    // }
}
