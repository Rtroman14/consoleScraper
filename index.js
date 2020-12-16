let navLength = document.querySelectorAll("#tabs > ul > li");

const contactIndex = (navLength) => {
    for (let i = 0; i < navLength.length; i++) {
        if (navLength[i].innerText === "Contacts") {
            return i;
        }
    }
};

// click "Contacts" tab
navLength[contactIndex()].querySelector("a").click;
