let properties = [];

let run = true;

const getText = (doc, selector) => {
    if (doc.querySelector(selector)) {
        return doc.querySelector(selector).innerText;
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

let page = 0;

localStorage.removeItem("properties");

while (run) {
    await delay(3000);

    let property = {};

    try {
        // Building & Lot Tab
        document.querySelector("#property-details-tab-building").click();
        await delay(5000);

        property.address = getText(document, "p[data-testid='header-property-address']");

        if (property.address.split(",").length === 3) {
            property.street = property.address.split(", ")[0];
            property.city = property.address.split(", ")[1]; // DOUBLE CHECK
            property.state = property.address.split(", ")[2].split(" ")[0];
            property.zip = property.address.split(" ").pop();
        } else {
            property.street = "";
            property.city = property.address.split(", ")[0];
            property.state = property.address.split(" ")[1];
            property.zip = property.address.split(" ").pop();
        }

        // Building & Lot > Building section
        let buildingSection = document.querySelector(
            "#property-details-section-building .MuiGrid-container .MuiGrid-item"
        );
        // Building & Lot > Lot section
        let lotSection = document.querySelector(
            "#property-details-section-building .MuiGrid-container .MuiGrid-item:nth-child(2)"
        );

        property.yearBuild = getText(buildingSection, "dl:nth-child(1) dd");
        property.yearRenovated = getText(buildingSection, "dl:nth-child(2) dd");
        property.buildingArea = buildingSection
            .querySelector("dl:last-child dd")
            .innerText.split(" ")[0];

        property.type = getText(lotSection, "dl:nth-child(1) dd");

        // Owner tab
        document.querySelector("#property-details-tab-ownership").click();
        await delay(5000);

        let reportedOwnerSection = document.querySelector("#reported-owner-info");
        property.companyName = getText(
            reportedOwnerSection,
            "#reported-owner-info > div:nth-child(2)"
        );
        property.companyAddress = getText(
            reportedOwnerSection,
            "#reported-owner-info > div:last-child"
        );

        let peopleSections = document.querySelectorAll("[data-testid='people-container-id']");

        for (let [index, person] of peopleSections.entries()) {
            let mobileNum = 0;

            property[`person-${index}_name`] = getText(person, "[data-testid='people-name-id']");

            let contactInfo = person.querySelectorAll("[data-testid='people-contact-id'] > div");

            property[`person-${index}_email`] = getText(
                person,
                "[data-testid='people-contact-email-id']"
            );

            for (let info of contactInfo) {
                let svg = info.querySelector("svg").innerHTML;
                if (svg.length === 993) {
                    // mobile
                    property[`person-${index}_mobile-${mobileNum}`] = getText(
                        info,
                        "[data-testid='people-contact-phone-id']"
                    );

                    mobileNum++;
                }
            }
        }

        properties.push(property);
        localStorage.setItem("properties", JSON.stringify(properties));

        const [currentProperty, , totalProperties] = document
            .querySelector("#search-box-results")
            .innerText.split("\n");

        if (currentProperty === totalProperties) {
            exportFile(properties, `reonomy pages 0-${page}.json`);
            run = false;
        }

        if (page !== 0 && page % 100 === 0) {
            exportFile(properties, `reonomy pages 0-${page}.json`);
        }

        if (!run) {
            exportFile(properties, `reonomy pages 0-${page}.json`);
        }

        // next page
        document.querySelector("#search-results-step-up").click();
        page++;

        console.log(properties);
    } catch (error) {
        console.log("CP IS A PUSS ---", error);

        exportFile(properties, `reonomy pages 0-${page}.json`);
        run = false;
    }
}
