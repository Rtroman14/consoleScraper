const allData = [];
const contractors = document.querySelectorAll(".col-md-12.data");

for (let contractor of contractors) {
    const contractorObj = {};

    const company = contractor.querySelector(".col-md-6 > a");
    contractorObj.company = company.innerText;
    contractorObj.website = company.href;

    const location = contractor.querySelector(".col-md-4");
    contractorObj.location = location.innerText;

    const revenue = contractor.querySelector(".col-md-2");
    contractorObj.revenue = revenue.innerText;

    allData.push(contractorObj);
}
