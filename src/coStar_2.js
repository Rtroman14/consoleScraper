let allData = [];

let run = true;

const getText = async (doc, selector) => {
    return await doc.querySelector(selector).innerText;
};

const contactIndex = (navLength) => {
    for (let i = 0; i < navLength.length; i++) {
        if (navLength[i].innerText === "Contacts") {
            return i;
        }
    }
};

const getContactInfo = (contacts, coStar, section) => {
    for (let [i, contact] of contacts.entries()) {
        let contactSpans = contact.querySelectorAll("figcaption > address > *");
        // go into each span on contacts contact info
        contactSpans.forEach((contactSpan, index) => {
            let contactInfo = contactSpan.innerText;
            if (index === 0) {
                coStar[`${section}_Name_${i + 1}`] = contactInfo;
            } else if (
                contactInfo.includes("(m)") ||
                contactInfo.includes("(p)") ||
                // check if phone number
                /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(contactInfo)
            ) {
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

    coStar[`${sectionTitle}_Website`] = getWebsite(".contact-section address > a ~ a");

    // get all PLC contacts
    let sectionContacts = contactSection.querySelectorAll(
        "div:nth-child(2) > div:last-child > div"
    );

    // go into each PLC contact
    if (sectionContacts.length > 0) {
        getContactInfo(sectionContacts, coStar, sectionTitle);
    }
};

const getBuildingInfo = (selector) => {
    if (selector === "yearBuilt_line1") {
        if (document.querySelector("[automation-id=yearBuilt_line1]")) {
            return document
                .querySelector("[automation-id=yearBuilt_line1]")
                .innerText.split(" ")[2];
        }
    }

    if (document.querySelector(`[automation-id=${selector}]`)) {
        return document.querySelector(`[automation-id=${selector}]`).innerText;
    }

    if (selector === "built_line1") {
        if (document.querySelector("[automation-id=yearBuilt_line1]")) {
            return document
                .querySelector("[automation-id=yearBuilt_line1]")
                .innerText.split(" ")[0];
        }
    }

    return "";
};

const getWebsite = (selector) => {
    if (document.querySelector(selector)) {
        return document.querySelector(selector).href;
    }

    return "";
};

const getImage = (selector) => {
    if (document.querySelector(selector)) {
        return document.querySelector(selector).src;
    }

    return "";
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let pages = 0;

while (run) {
    await delay(8000);
    const state = {
        isContactsTab: false,
    };

    let navLength = document.querySelectorAll("#tabs > ul > li");

    if (navLength.length < 5) {
        state.isContactsTab = false;
        let nextPage = document.querySelector(
            "#NewSearchNavigationLayout_NavigationButtons > a ~ a"
        );
        nextPage.click();
    } else {
        if (!state.isContactsTab) {
            navLength[contactIndex(navLength)].querySelector("a").click();
            state.isContactsTab = true;
            await delay(3000);
        }

        let coStar = {};

        pages++;

        let addressStreet = await getText(document, "#header > div > div");
        let addressCity = await getText(document, "#header > div > div > div > div > div");

        coStar.image = await getImage(".detail-images img");

        coStar.address = `${addressStreet} ${addressCity}`;

        coStar.sf = getBuildingInfo("buildingSize_line1");
        coStar.built = getBuildingInfo("built_line1");
        coStar.renovation = getBuildingInfo("yearBuilt_line1");

        coStar.website = getWebsite("#header > div ~ div a");

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
            } else if (sectionHeader === "Recorded Owner") {
                await getSections(coStar, "recordedOwner", contactSection);
            } else if (sectionHeader === "Previous True Owner") {
                await getSections(coStar, "previousTrueOwner", contactSection);
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
