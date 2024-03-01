function showNotification(message, type) {
    popUp.id = "notification-popup";
    popUp.classList.add(type); // Add class for color (e.g., "success", "danger")

    content.classList.add("popup-content");
    content.textContent = message;

    popUp.appendChild(content);
    document.body.appendChild(popUp);

    setTimeout(() => {
        document.body.removeChild(popUp);
    }, 1000);
}

function showNotification(message, type) {
    const popUp = document.createElement("div");
    popUp.id = "notification-popup";
    popUp.classList.add(type); // Add class for color (e.g., "success", "danger")

    const content = document.createElement("div");
    content.classList.add("popup-content");
    content.textContent = message;

    popUp.appendChild(content);
    document.body.appendChild(popUp);

    setTimeout(() => {
        document.body.removeChild(popUp);
    }, 1000);
}

function addTask(editExsistingTaskUpdate) {
    let userData = addInputField.value.trim();

    if (!isValidInput(userData)) {
        showNotification("special charactors are not allowed", "danger");
        return;
    } else if (userData.length === 0) {
        showNotification("", "warning");
        return;
    }

    let pendingListArr = JSON.parse(localStorage.getItem('Pending Todos')) || [];
    let completeListArr = JSON.parse(localStorage.getItem('Complete Todos')) || [];

    let allTasksArr = [...pendingListArr, ...completeListArr]; // Combine both lists

    allTasksArr = allTasksArr.map(item => item.toLowerCase());

    if (pendingListArr.includes(editExsistingTaskUpdate)) {
        pendingListArr.splice(pendingListArr.indexOf(editExsistingTaskUpdate), 1);
        editExsistingTask = ""
    }

    if (!allTasksArr.includes(userData.toLowerCase())) {

        pendingListArr.unshift(userData);
        localStorage.setItem("Pending Todos", JSON.stringify(pendingListArr));
        showtask();

        addInputField.value = "";

        if (editExsistingTaskUpdate == "") {
            showNotification("ToDo is added Successfully", "success");
        } else {
            showNotification("ToDo is edited Successfully1", "success");
            addTaskBtn.style.display = "block";
            saveTaskBtn.style.display = "none";
            btns[0].click()
        }
        addTaskBtn.classList.remove("active");

        let newTaskElement = document.querySelector('.pending li'); //for scroll top
        if (newTaskElement) {
            newTaskElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        btns[0].click();

    } else {
        showNotification("Task already exists", "danger");
    }
}

function isValidInput(input) {
    const pattern = /^[a-zA-Z0-9 ]*$/;
    return pattern.test(input);
}

module.exports = showNotification;