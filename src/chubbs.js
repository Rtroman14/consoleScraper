let allData = [];

let allRows = document.querySelectorAll("._26kbfNl9ez");

for (let row of allRows) {
    let info = {};

    info.title = row.querySelector(".iRy7oPYa_P").innerText;

    let allContactInfo = row.querySelectorAll("span._2VKg3kCtVc");

    let address = [];

    for (let contactInfo of allContactInfo) {
        let element = contactInfo.innerText;
        if (element.includes("http")) {
            info.website = element;
        } else if (element.includes("@")) {
            info.email = element;
        } else if (element.includes("-")) {
            info.phone = element;
        } else {
            address.push(element);
        }
    }

    info.address = address.join(" ");

    allData.push(info);
}
