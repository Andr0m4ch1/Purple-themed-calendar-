const currentDate = document.querySelector(".current-date"),
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons span");

const modal = document.getElementById("todo-modal");
const closeBtn = document.querySelector(".close-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalTitle = document.getElementById("modal-date-title");
const addTodoBtn = document.getElementById("add-todo-btn");
const newTodoInput = document.getElementById("new-todo-input");
const todoList = document.getElementById("todo-list");
const pinList = document.getElementById("pin-list");
const addPinBtn = document.getElementById("add-pin-btn");
const newPinInput = document.getElementById("new-pin-input");
const deletePinBtn = document.getElementById("delete-pin-btn");
const deleteTodoBtn = document.getElementById("delete-todo-btn");

let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
let selectedDateStr = "";

const months = ["January", "February", "March", "April", "May", "June", "July", 
                "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDateofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDateofMonth; i > 0; i--) {
         liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                    && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
          liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    const allDays = daysTag.querySelectorAll("li");
    const todayExact = new Date();
    todayExact.setHours(0, 0, 0, 0);

    allDays.forEach(day => {
        day.addEventListener("click", () => {
            if(!day.classList.contains("inactive")) {
                const clickedDate = new Date(currYear, currMonth, parseInt(day.innerText));
                
                if (clickedDate < todayExact) {
                    alert("You cannot add a to-do for a past date.");
                    return;
                }

                selectedDateStr = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(day.innerText).padStart(2, '0')}`;
                
                modalTitle.innerText = `To-Do: ${day.innerText} ${months[currMonth]}`;
                modal.style.display = "flex";
                todoList.innerHTML = ""; 
                pinList.innerHTML = "";
                
                fetch(`/api/notes/${selectedDateStr}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.note) {
                        todoList.innerHTML = `<li>${data.note}</li>`;
                    }
                }).catch(err => console.error(err));
            }
        });
    });
};

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

const closeModal = () => {
    modal.style.display = "none";
};

closeBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

addPinBtn.addEventListener("click", () => {
    const note = newPinInput.value;
    
    if (note.trim() !== "") {
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: selectedDateStr, content: note, type: 'pin' })
        }).then(() => {
            pinList.innerHTML += `<li>📌 ${note}</li>`;
            newPinInput.value = ""; 
        }).catch(err => console.error(err));
    }
});

deletePinBtn.addEventListener("click", () => {
    fetch(`/api/notes/pin/${selectedDateStr}`, { 
        method: 'DELETE'
    }).then(() => {
        pinList.innerHTML = ""; 
    }).catch(err => console.error(err));
});

addTodoBtn.addEventListener("click", () => {
    const note = newTodoInput.value;
    
    if (note.trim() !== "") {
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: selectedDateStr, content: note, type: 'todo' })
        }).then(() => {
            todoList.innerHTML += `<li>${note}</li>`;
            newTodoInput.value = ""; 
        }).catch(err => console.error(err));
    }
});

deleteTodoBtn.addEventListener("click", () => {
    fetch(`/api/notes/${selectedDateStr}`, {
        method: 'DELETE'
    }).then(() => {
        todoList.innerHTML = ""; 
    }).catch(err => console.error(err));    
});