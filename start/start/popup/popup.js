let tasks = [];

function updateTime() {
    chrome.storage.local.get(["timer"], (res) => {
        const timer = document.getElementById("time")
        const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2)
        let seconds = "00";
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2)
        }
        timer.textContent = `${minutes}:${seconds}`
    })
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })
    })
})

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "Start Timer"
    })
})

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : [];
    renderTask();
})

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    const taskflow = document.createElement("div");

    const text = document.createElement("input")
    text.type = "text";
    text.placeholder = "Enter a task";
    text.value = tasks[taskNum]
    text.addEventListener("change", () => {
        tasks[tasksNum] = text.value
        saveTasks();
    })

    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X";
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum);
    })

    taskflow.appendChild(text);
    taskflow.appendChild(deleteBtn);

    const taskContainer = document.getElementById("task-container");
    taskContainer.appendChild(taskflow);
}

function addTask() {
    const tasksNum = tasks.length
    tasks.push("");
    renderTask(tasksNum)
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1)
    renderTasks()
}

function renderTasks() {
    const taskContaner = document.getElementById("task-container");
    taskContaner.textContent = "";
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum)
    })
}