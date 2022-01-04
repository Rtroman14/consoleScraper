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

let state;

while (run) {
    await delay(3000);

    let property = {};

    try {
        // Building & Lot Tab
        document.querySelector("#property-details-tab-building").click();
        await delay(4000);

        let error = document.querySelector(
            "#root > div > div > div > div:nth-child(3) > div.MuiPaper-root.jss388.jss389.jss390.jss392.MuiPaper-elevation0.MuiPaper-rounded > header > h6 > svg"
        );
        if (error !== null) {
            document.querySelector("#search-results-step-up").click();

            await delay(4000);

            document.querySelector("#property-details-tab-building").click();
        }

        property.Address = getText(document, "p[data-testid='header-property-address']");

        let currentState;

        if (property.Address.split(",").length === 3) {
            currentState = property.Address.split(", ")[2].split(" ")[0];
            state = currentState.length > 2 ? state : currentState;

            property.Street = property.Address.split(", ")[0];
            property.City = property.Address.split(", ")[1]; // DOUBLE CHECK
            property.Zip = property.Address.split(" ").pop();
        } else if (property.Address.length === 2) {
            property.State = property.Address;
        } else {
            currentState = property.Address.split(" ")[1];
            state = currentState.length > 2 ? state : currentState;

            property.Street = "";
            property.City = property.Address.split(", ")[0];
            property.Zip = property.Address.split(" ").pop();
        }

        property.State = state;

        // Building & Lot > Building
        let buildingSection = document.querySelector(
            "#property-details-section-building .MuiGrid-container .MuiGrid-item"
        );
        // Building & Lot > Lot
        let lotSection = document.querySelector(
            "#property-details-section-building .MuiGrid-container .MuiGrid-item:nth-child(2)"
        );

        const yearBuilt = getText(buildingSection, "dl:nth-child(1) dd");
        const yearRenovated = getText(buildingSection, "dl:nth-child(2) dd");

        property["Year Built"] = yearBuilt === "--" ? "" : yearBuilt;
        property["Year Renovated"] = yearRenovated === "--" ? "" : yearBuilt;

        let squareFeet = buildingSection.querySelector("dl:last-child dd").innerText.split(" ")[0];
        property["Square Feet"] = squareFeet === "--" ? "" : squareFeet;

        property["Building Type"] = getText(lotSection, "dl:nth-child(1) dd");

        property["Url"] = window.location.href;

        // Owner tab
        document.querySelector("#property-details-tab-ownership").click();
        await delay(4000);

        let reportedOwnerSection = document.querySelector("#reported-owner-info");
        property["Company Name"] = getText(
            reportedOwnerSection,
            "#reported-owner-info > div:nth-child(2)"
        );
        property["Company Address"] = getText(
            reportedOwnerSection,
            "#reported-owner-info > div:last-child"
        );

        // if "More" contacts, click
        let morePeopleBtn = document.querySelector("[data-testid='plus-more-people-button-id']");

        if (morePeopleBtn) {
            morePeopleBtn.click();
        }

        await delay(2000);

        let peopleSections = document.querySelectorAll("[data-testid='people-container-id']");

        for (let [index, person] of peopleSections.entries()) {
            let contact = {};

            const fullName = getText(person, "[data-testid='people-name-id']");
            let title = getText(person, "[data-testid='people-name-id'] ~ div");

            if (title.includes("Signed mortgage")) {
                title = "Signed mortgage";
            } else if (title.includes("Reported Owner")) {
                title = "Owner";
            } else if (title.includes("Owner of")) {
                title = "Owner";
            } else {
                title = title.slice(title.lastIndexOf("(")).match(/\(([^)]+)\)/)[1];
            }

            contact["Full Name"] = fullName;
            contact["First Name"] = fullName.split(" ")[0] || "";
            contact["Last Name"] = fullName.split(" ").slice(1).join(" ") || "";
            contact["Email"] = getText(person, "[data-testid='people-contact-email-id']");
            contact.Title = title;
            contact.Source = "Reonomy";

            let contactInfo = person.querySelectorAll("[data-testid='people-contact-id'] > div");

            if (contactInfo.length) {
                contact["Contact Address"] = contactInfo[contactInfo.length - 1].innerText;
            }

            for (let info of contactInfo) {
                let svg = info.querySelector("svg").innerHTML;

                contact["Phone Number"] = "";
                contact["Phone Type"] = "";

                if (svg.length >= 850 && svg.length <= 900) {
                    // mobile
                    contact["Phone Number"] = getText(
                        info,
                        "[data-testid='people-contact-phone-id']"
                    );
                    contact["Phone Type"] = "Mobile";
                    contact.Outreach = "Text";

                    properties.push({ ...property, ...contact });
                }

                if (svg.length === 1363) {
                    // landline
                    contact["Phone Number"] = getText(
                        info,
                        "[data-testid='people-contact-phone-id']"
                    );
                    contact["Phone Type"] = "Landline";
                    contact.Outreach = "Email";

                    properties.push({ ...property, ...contact });
                }
            }
        }

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
    } catch (error) {
        console.log("CP IS A PUSS ---", error);

        exportFile(properties, `reonomy pages 0-${page}.json`);
        run = false;
    }
}
