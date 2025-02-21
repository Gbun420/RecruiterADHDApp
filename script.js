document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput = document.getElementById('categoryInput');
    const reminderDateInput = document.getElementById('reminderDateInput');
    const reminderTimeInput = document.getElementById('reminderTimeInput');

    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const category = categoryInput.value;
    const reminderDate = reminderDateInput.value;
    const reminderTime = reminderTimeInput.value;

    if (taskText !== "") {
        const taskItem = createTaskElement(taskText, priority, category, reminderDate, reminderTime, false); // Initial completion status is false
        taskList.appendChild(taskItem);
        saveTask(taskText, priority, category, reminderDate, reminderTime, false); // Save completion status
        taskInput.value = "";
        reminderDateInput.value = "";
        reminderTimeInput.value = "";
    }
}

function createTaskElement(taskText, priority, category, reminderDate, reminderTime, completed) {
    const taskItem = document.createElement('li');
    taskItem.classList.add(priority + '-priority');
    let reminderText = "";
    if (reminderDate && reminderTime) {
        reminderText = `<span class="task-reminder">Reminder: ${reminderDate} ${reminderTime}</span>`;
    } else if (reminderDate) {
        reminderText = `<span class="task-reminder">Reminder Date: ${reminderDate}</span>`;
    } else if (reminderTime) {
        reminderText = `<span class="task-reminder">Reminder Time: ${reminderTime}</span>`;
    }

    const checkedAttribute = completed ? 'checked' : ''; // Determine if checkbox should be checked

    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${checkedAttribute} onclick="toggleComplete(this)">
        <span class="task-text ${completed ? 'completed' : ''}">${taskText}</span>
        <span class="task-category">Category: ${category}</span>
        <span class="task-priority">Priority: ${priority}</span>
        ${reminderText}
        <button onclick="removeTask(this)">Delete</button>
    `;
    return taskItem;
}


function removeTask(deleteButton) {
    const taskList = document.getElementById('taskList');
    const taskItem = deleteButton.parentElement;
    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Priority: ', '');
    const taskCategory = taskItem.querySelector('.task-category').textContent.replace('Category: ', '');
    const taskReminder = taskItem.querySelector('.task-reminder')?.textContent || "";
    const taskCompleted = taskItem.querySelector('.task-checkbox').checked; // Get completion status

    taskList.removeChild(taskItem);
    removeSavedTask(taskText, taskPriority, taskCategory, taskReminder, taskCompleted); // Remove with completion status
}


function saveTask(taskText, priority, category, reminderDate, reminderTime, completed) {
    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, priority: priority, category: category, reminderDate: reminderDate, reminderTime: reminderTime, completed: completed }); // Save completion status
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    let tasks = getTasksFromStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.priority, task.category, task.reminderDate, task.reminderTime, task.completed); // Load completion status
        taskList.appendChild(taskItem);
    });
}

function getTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}


function removeSavedTask(taskText, priority, category, reminderText, completed) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => !(
        task.text === taskText &&
        task.priority === priority &&
        task.category === category &&
        (task.reminderDate + " " + task.reminderTime).trim() === reminderText.replace("Reminder: ", "").replace("Reminder Date: ", "").replace("Reminder Time: ", "").trim() &&
        task.completed === completed // Compare completion status
    ));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function toggleComplete(checkbox) {
    const taskItem = checkbox.parentElement;
    const taskTextSpan = taskItem.querySelector('.task-text');
    taskTextSpan.classList.toggle('completed'); // Toggle strikethrough

    const taskText = taskItem.querySelector('.task-text').textContent;
    const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Priority: ', '');
    const taskCategory = taskItem.querySelector('.task-category').textContent.replace('Category: ', '');
    const taskReminder = taskItem.querySelector('.task-reminder')?.textContent || "";

    updateCompletionStatus(taskText, taskPriority, taskCategory, taskReminder, checkbox.checked); // Update in local storage
}


function updateCompletionStatus(taskText, priority, category, reminderText, completed) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (
            task.text === taskText &&
            task.priority === priority &&
            task.category === category &&
            (task.reminderDate + " " + task.reminderTime).trim() === reminderText.replace("Reminder: ", "").replace("Reminder Date: ", "").replace("Reminder Time: ", "").trim()
        ) {
            return { ...task, completed: completed }; // Update completed status
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function updateTaskOrder() {
    const taskList = document.getElementById('taskList');
    const taskItems = Array.from(taskList.children); // Get current task order from DOM
    const updatedTasks = [];

    taskItems.forEach(taskItem => {
        const taskText = taskItem.querySelector('.task-text').textContent;
        const taskPriority = taskItem.querySelector('.task-priority').textContent.replace('Priority: ', '');
        const taskCategory = taskItem.querySelector('.task-category').textContent.replace('Category: ', '');
        const taskReminder = taskItem.querySelector('.task-reminder')?.textContent || "";
        const taskCompleted = taskItem.querySelector('.task-checkbox').checked;


        updatedTasks.push({
            text: taskText,
            priority: taskPriority,
            category: taskCategory,
            reminderDate: taskReminder.includes("Date:") ? taskReminder.split("Date: ")[1].trim().split(" ")[0] : (taskReminder.includes("Reminder:") ? taskReminder.split("Reminder: ")[1].trim().split(" ")[0] : ""), // Extract date part, handle cases
            reminderTime: taskReminder.includes("Time:") ? taskReminder.split("Time: ")[1].trim() : (taskReminder.includes("Reminder:") ? taskReminder.split("Reminder: ")[1].trim().split(" ")[1] : ""), // Extract time part, handle cases
            completed: taskCompleted
        });
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save the updated order
}
