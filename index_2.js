let allData = [];

let run = true;

const getText = async (doc, selector) => {
    return await doc.querySelector(selector).innerText;
};

const getContactInfo = (contacts, coStar, section) => {
    for (let [i, contact] of contacts.entries()) {
        let contactSpans = contact.querySelectorAll("figcaption > address > *");
        // go into each span on contacts contact info
        contactSpans.forEach((contactSpan, index) => {
            let contactInfo = contactSpan.innerText;
            if (index === 0) {
                coStar[`${section}_Name_${i + 1}`] = contactInfo;
            } else if (contactInfo.includes("(m)")) {
                coStar[`${section}_Phone_${i + 1}`] = contactInfo;
            } else if (contactInfo.includes("@")) {
                coStar[`${section}_Email_${i + 1}`] = contactInfo;
            }
        });
    }
};

const getSections = async (coStar, sectionTitle, contactSection) => {
    coStar[`${sectionTitle}_Company`] = await getText(
        contactSection,
        ".contact-section address > a"
    );

    // get all PLC contacts
    let sectionContacts = contactSection.querySelectorAll(
        "div:nth-child(2) > div:last-child > div"
    );

    // go into each PLC contact
    if (sectionContacts.length > 0) {
        getContactInfo(sectionContacts, coStar, sectionTitle);
    }
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let pages = 0;

while (run) {
    await delay(8000);
    const state = {
        isContactsTab: false,
    };

    let navLength = document.querySelectorAll("#tabs > ul > li");

    if (navLength < 5) {
        state.isContactsTab = false;
        let nextPage = document.querySelector(
            "#NewSearchNavigationLayout_NavigationButtons > a ~ a"
        );
        nextPage.click();
    } else {
        if (!state.isContactsTab) {
            navLength[7].querySelector("a").click();
            await delay(3000);
            state.isContactsTab = true;
        }

        let coStar = {};

        pages++;

        let addressStreet = await getText(document, "#header > div > div");
        let addressCity = await getText(document, "#header > div > div > div > div > div");

        coStar.address = `${addressStreet} ${addressCity}`;

        let buildingInfo = document.querySelectorAll("#header > div > div > div:last-child > div");

        for (let info of buildingInfo) {
            let infoTitle = await getText(info, "div ~ div");

            if (infoTitle === "Built") {
                coStar.built = await getText(info, "div");
            } else if (infoTitle === "SF RBA") {
                coStar.sf = await getText(info, "div");
            }
        }

        // get section rows
        let contactSections = document.querySelectorAll(".contact-section");

        for (let contactSection of contactSections) {
            let sectionHeader = await getText(contactSection, ".contact-section > div");

            if (sectionHeader === "Primary Leasing Company") {
                await getSections(coStar, "primaryLeasingCompany", contactSection);
            } else if (sectionHeader === "True Owner") {
                await getSections(coStar, "trueOwner", contactSection);
            } else if (sectionHeader === "Property Management") {
                await getSections(coStar, "propertyManagement", contactSection);
            }
        }

        let nextPage = document.querySelector(
            "#NewSearchNavigationLayout_NavigationButtons > a ~ a"
        );

        allData.push(coStar);

        if (pages % 5 === 0) {
            exportFile(allData, `coStart_Pages 0-${pages}.json`);
        }

        await delay(3000);
        nextPage.click();
    }

    // run = false;
}
