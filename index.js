/**
 * Initialize task category data structures
 * @type {Map<any, any>} tasks - Map of tasks with category IDs as keys and arrays of tasks as values.
 * @type {Map<string, {name: string}>} categories - Map of categories with category IDs as keys and category names as values.
 * @type {string} activeCategoryId - ID of the currently active category.
 */

let tasks = new Map();
let categories = new Map();
let activeCategoryId = null;

//Displate Date
window.onload = function () {
    setInterval(function () {
        var date = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        var formattedDate = date.toLocaleDateString(undefined, options);
        document.getElementById('datetime').innerHTML = formattedDate;
    }, 1000); // 1000 milliseconds = 1 second
}

/**
 * Initialize the application after DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        requestNotificationPermission();
        initializeApp();
        initializeListeners();
    }, 0); // Deferring initialization
});

/**
 * Initialize the application.
 */
const initializeApp = () => {
    loadCategoriesFromLocalStorage();
    displayCategories();
    loadTasksFromLocalStorage().then(() => {
        console.log('Tasks loaded!')
    });

    // Periodically Check for due tasks.
    setInterval(checkTasksDueDate, 30000); // Check every thirty seconds
}

/**
 * Initialize event listeners for UI elements.
 */
const initializeListeners = () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const addTaskBox = document.getElementById('addTaskBox');
    
    //search event listener
    document.getElementById("search-box").addEventListener("input", searchTasks);


    addTaskButton.addEventListener('click', () => {
        const taskDescription = addTaskBox.value.trim();
        if (taskDescription) {
            addTask(taskDescription);
            addTaskBox.value = ''; // Clear the input box after adding the task.
        } else {
            alert("You must input a task!");
        }
    });

    // Setting up event delegation for the date icon click.
    document.getElementById("tasks-container").addEventListener("click", function (e) {
        if (e.target.closest(".secondary-button")) {
            const taskElement = e.target.closest("li[data-task-id]");
            if (taskElement) {
                const taskId = taskElement.getAttribute("data-task-id");
                toggleDatePicker(taskId);
            }
        }
    });
}

/**
 * Create a new category.
 */
const createCategory = (categoryName = null) => {
    const categoryBox = document.getElementById("categoryBox");
    // Use categoryName if it's not null, otherwise use the trimmed value from the input box.
    const finalCategoryName = categoryName !== null ? categoryName : categoryBox.value.trim();
    console.log(finalCategoryName)

    if (finalCategoryName === "") {
        alert("You must input a category name");
        return;
    }

    // Check if the category name already exists.
    if ([...categories.values()].some(category => category.name?.trim().toLowerCase() === finalCategoryName.toLowerCase())) {
        alert("Category with this name already exists");
        return;
    }


    // Creating a unique category ID.
    const newCategoryId = `CATEGORY-${Date.now()}`;

    // Adding the new category to the categories Map.
    categories.set(newCategoryId, { name: finalCategoryName });

    // Persist the updated categories Map to local storage.
    saveCategoriesToLocalStorage();

    // Refresh the categories displayed on the page.
    displayCategories();

    // Clear the input box after adding the category.
    categoryBox.value = "";
}


/**
 * Add a new category to the UI.
 * @param {string} newCategoryId - The ID of the new category.
 * @param {string} categoryName - The name of the new category.
 */
const addCategoryUI = (newCategoryId, categoryName) => {
    const categoryContainer = document.getElementById("categoryContainer");

    const radioContainer = document.createElement("div");
    radioContainer.className = "radio-container";

    const radioItem = document.createElement("input");
    radioItem.type = "radio";
    radioItem.name = "category";
    radioItem.className = "custom-radio";
    radioItem.id = newCategoryId;
    radioItem.checked = newCategoryId === activeCategoryId;

    const radioLabel = document.createElement("label");
    radioLabel.className = "radio-label";
    radioLabel.setAttribute("for", newCategoryId);
    radioLabel.textContent = categoryName;

    radioLabel.addEventListener("click", () => {
        setActiveCategory(newCategoryId);
    });

    // Edit button.
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
        const newName = prompt("Edit category name:", categoryName);
        if (newName === null) {
            // User cancelled the prompt
            return;
        }
        if (newName.trim() !== "" && newName.trim().toLowerCase() !== categoryName.toLowerCase()) {
            // Further validation to ensure uniqueness can be added here
            categories.set(newCategoryId, { name: newName.trim() });
            saveCategoriesToLocalStorage();
            displayCategories();
        }
    });


    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this category and all its tasks?")) {
            categories.delete(newCategoryId);
            tasks.delete(newCategoryId); // Delete tasks associated with the category
            saveCategoriesToLocalStorage();
            saveTasksToLocalStorage(); // Save the updated tasks map

            if (newCategoryId === activeCategoryId) {
                if (categories.size > 0) {
                    // Set activeCategoryId to the last key in the Map
                    activeCategoryId = Array.from(categories.keys())[categories.size - 1];
                } else {
                    // If no categories are left, reset activeCategoryId
                    activeCategoryId = null;
                }
            }

            displayCategories();
            displayTasksForActiveCategory();

            // If there are remaining categories, set the new active category
            if (activeCategoryId !== null) {
                setActiveCategory(activeCategoryId);
            }
        }
    });


    // Append elements to their respective parents.
    radioContainer.appendChild(radioItem);
    radioContainer.appendChild(radioLabel);
    radioContainer.appendChild(editButton);
    radioContainer.appendChild(deleteButton);
    categoryContainer.appendChild(radioContainer);
}

/**
 * Save the categories to local storage.
 */
const saveCategoriesToLocalStorage = () => {
    localStorage.setItem('categories', JSON.stringify(Array.from(categories.entries())));
    localStorage.setItem('activeCategoryId', activeCategoryId);
}

/**
 * Load categories from local storage.
 */
const loadCategoriesFromLocalStorage = () => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories && storedCategories.length > 0) {
        categories = new Map(storedCategories);
        // Set the first category as active if activeCategoryId is not set
        if (!activeCategoryId) {
            activeCategoryId = categories.keys().next().value;
        }
    } else {
        createCategory("My Daily Tasks")
    }
    displayCategories();
    displayTasksForActiveCategory();
    setActiveCategory(activeCategoryId);
};


/**
 * Save tasks to local storage.
 */
const saveTasksToLocalStorage = () => {
    const tasksArray = Array.from(tasks.entries());
    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

/**
 * Load tasks from local storage.
 */
const loadTasksFromLocalStorage = async () => {
    const tasksArray = await new Promise((resolve) => {
        setTimeout(() => {
            const data = localStorage.getItem("tasks");
            resolve(data ? JSON.parse(data) : []);
        }, 500);
    });

    // If tasksArray is an array of arrays, assume it's in the correct format for a Map
    if (Array.isArray(tasksArray) && tasksArray.every(item => Array.isArray(item))) {
        tasks = new Map(tasksArray);
    } else if (tasksArray.length === 0) {
        // If the array is empty, create an empty map.
        tasks = new Map();
    } else {
        console.error("Loaded tasks data is not in the expected format:", tasksArray);
        // initialize with an empty map
        tasks = new Map();
    }
    // Call after data is fully loaded.
    displayTasksForActiveCategory();
};

/**
 * Add a new task.
 *
 * @param {string} taskDescription - The description of the task.
 */
const addTask = (taskDescription) => {
    if (!taskDescription || taskDescription.trim() === "") {
        alert("You must input a task!");
        return;
    }

    // Generate a unique task ID.
    const newTaskId = `TASK-${new Date().getTime()}`;

    // Create the task object.
    const newTask = {
        id: newTaskId,
        description: taskDescription.trim(),
        completed: false,
        urgency: "normal",
        dueDate: null,
        notified: false
    };

    // Update the tasks Map with the new task for the active category.
    const currentTasksForCategory = tasks.get(activeCategoryId) || [];
    currentTasksForCategory.push(newTask);
    tasks.set(activeCategoryId, currentTasksForCategory);

    // Persist the updated tasks to local storage.
    saveTasksToLocalStorage();

    // Refresh the UI to include the new task.
    displayTasksForActiveCategory();

    // Clear the input box.
    document.getElementById("addTaskBox").value = "";
}

/**
 * Set the active category.
 *
 * @param {string} categoryId - The ID of the category to set as active.
 */
const setActiveCategory = (categoryId) => {
    // update the active category ID.
    activeCategoryId = categoryId;

    // Refresh the tasks displayed to match the new active category.
    displayTasksForActiveCategory();

    // highlight the active category.
    updateCategoryUI(categoryId);

    // Update the title to match the active category's name.
    updateCategoryTitle(categoryId);
}

/**
 * Update the UI to reflect the active category.
 *
 * @param {string} categoryId - The ID of the active category.
 */
const updateCategoryUI = (categoryId) => {
    // Remove 'active' class from all category labels first.
    const categoryLabels = document.querySelectorAll('.radio-label');
    categoryLabels.forEach(label => {
        label.classList.remove('active');
    });

    // Add 'active' class to the active category label.
    const activeLabel = document.querySelector(`label[for="${categoryId}"]`);
    if (activeLabel) {
        activeLabel.classList.add('active');
    }
}

/**
 * Update the category title in the UI.
 *
 * @param {string} categoryId - The ID of the active category.
 */
const updateCategoryTitle = (categoryId) => {
    const categoryTitleElement = document.getElementById('category-title');
    const category = categories.get(categoryId);
    if (category && categoryTitleElement) {
        categoryTitleElement.textContent = category.name;
    }
}

/**
 * Display the categories in the UI.
 */
const displayCategories = () => {
    const categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = ''; // Clear existing categories UI.

    categories.forEach((category, id) => {
        // Call addCategoryUI to create and append its UI components.
        addCategoryUI(id, category.name);
    });

    // Update the UI to reflect the currently active category if needed.
    if (activeCategoryId) {
        updateCategoryUI(activeCategoryId);
    }
};


/**
 * Display tasks for the active category in the UI.
 */
const displayTasksForActiveCategory = () => {
    const taskList = document.getElementById("tasks-container");
    const completedTaskList = document.getElementById("completed-tasks-container");
    // Clear existing tasks.
    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    const currentTasks = tasks.get(activeCategoryId) || [];
    console.log('Tasks: ', currentTasks.length);

    if (currentTasks.length > 0) {
        currentTasks.forEach(task => {
            const listItem = document.createElement("li");
            listItem.className = "task";
            listItem.setAttribute('data-task-id', task.id);
            if (task.completed) {
                listItem.classList.add('completed');
                listItem.innerHTML = `
                    <label class="checklabel" style="position: relative;">
                        <input type="checkbox" checked class="task-checkbox" style="display:none;">
                        <span class="checkmark" onclick="toggleCheck('${task.id}')" ${task.completed ? 'data-checked="true"' : ''}></span>
                        <span class="label-text">${task.description}</span>
                    </label>
                    <div class="action-items">
                        <select class="drop-down" disabled>
                            <option value="low" ${task.urgency === "low" ? "selected" : ""}>Low</option>
                            <option value="normal" ${task.urgency === "normal" ? "selected" : ""}>Normal</option>
                            <option value="high" ${task.urgency === "high" ? "selected" : ""}>High</option>
                        </select>
                        <div class="duedate">
                            <label class="secondary-button"><i class="fa-solid fa-clock"></i></label>
                            <input type="datetime-local" class="datepicker" style="display:none;" value="${task.dueDate || ''}" disabled>
                        </div>
                        <button class="edit-button" style="display: none;"><i class="fa fa-edit"></i></button>
                        <button class="delete-button" onclick="deleteTask('${task.id}', this.parentElement.parentElement)"><i class="fa fa-trash"></i></button>
                    </div>
                `;
                completedTaskList.appendChild(listItem);
            } else {
                listItem.innerHTML = `
                <label class="checklabel" style="position: relative;">
                    <input type="checkbox" ${task.completed ? "checked" : ""} class="task-checkbox" style="display:none;">
                    <span class="checkmark" onclick="toggleCheck('${task.id}')" ${task.completed ? 'data-checked="true"' : ''}></span>
                    <span class="${task.completed ? "task-description completed" : "task-description"}">${task.description}</span>
                </label>
                <div class="action-items">
                    <select class="drop-down" onchange="updateTaskUrgency('${task.id}', this.value)">
                        <option value="low" ${task.urgency === "low" ? "selected" : ""}>Low</option>
                        <option value="normal" ${task.urgency === "normal" ? "selected" : ""}>Normal</option>
                        <option value="high" ${task.urgency === "high" ? "selected" : ""}>High</option>
                    </select>
                    <div class="duedate">
                        <label class="secondary-button"><i class="fa-solid fa-clock"></i></label>
                        <input type="datetime-local" class="datepicker" style="display:none;" value="${task.dueDate || ''}" onchange="updateTaskDueDate('${task.id}', this.value)">
                    </div>
                    <button class="edit-button" onclick="editTask('${task.id}')"><i class="fa fa-edit"></i></button>
                    <button class="delete-button" onclick="deleteTask('${task.id}', this.parentElement.parentElement)"><i class="fa fa-trash"></i></button>
                </div>
            `;
                taskList.appendChild(listItem);
            }
        });
    }

    const noTaskAdded = document.getElementById('no-task-added');
    if ((taskList && taskList.children.length > 0) || (completedTaskList && completedTaskList.children.length > 0)) {
        noTaskAdded.style.display = 'none';
    } else {
        noTaskAdded.style.display = 'flex';
    }

    const completedDivider = document.getElementById("completed-divider");
    if (completedTaskList && completedTaskList.children.length > 0) {
        // Make the completed-divider visible
        completedDivider.style.display = "flex";
    } else {
        completedDivider.style.display = "none";
    }
}

/**
 * Update the urgency of a task.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newUrgency - The new urgency level of the task.
 */
const updateTaskUrgency = (taskId, newUrgency) => {
    const currentTasks = tasks.get(activeCategoryId);
    if (currentTasks) {
        const task = currentTasks.find(t => t.id === taskId);
        if (task) {
            task.urgency = newUrgency;
            saveTasksToLocalStorage();

            // Refresh the tasks list.
            displayTasksForActiveCategory();
        }
    }
}

/**
 * Toggle the completion status of a task.
 *
 * @param {string} taskId - The ID of the task to toggle completion status for.
 */
const toggleCheck = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        const checkbox = taskElement.querySelector('.task-checkbox');
        const checkmark = taskElement.querySelector('.checkmark');

        // Toggle the checked state.
        checkbox.checked = !checkbox.checked;
        checkmark.setAttribute('data-checked', checkbox.checked);
        toggleTaskCompletion(taskId, checkbox.checked);
    }
}

/**
 * Toggle the completion status of a task.
 *
 * @param {string} taskId - The ID of the task to toggle completion status for.
 * @param {boolean} isCompleted - The new completion status of the task.
 */
const toggleTaskCompletion = (taskId, isCompleted) => {
    const currentTasks = tasks.get(activeCategoryId);
    if (currentTasks) {
        const task = currentTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = isCompleted;
            saveTasksToLocalStorage();
            displayTasksForActiveCategory();
        }
        //Adding a sound when task is checked
        const audio = document.getElementById("myAudio");
        audio.play();
    }
}

/**
 * Toggle the display of the date picker for a task.
 *
 * @param {string} taskId - The ID of the task for which to toggle the date picker.
 */
const toggleDatePicker = (taskId) => {
    const taskElement = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (taskElement) {
        const datepicker = taskElement.querySelector('.datepicker');
        if (datepicker) {
            datepicker.style.display = datepicker.style.display === 'none' ? 'block' : 'none';
        }
    }
};

/**
 * Update the due date of a task.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newDueDate - The new due date of the task.
 */
const updateTaskDueDate = (taskId, newDueDate) => {
    const currentTasks = tasks.get(activeCategoryId);
    if (currentTasks) {
        const task = currentTasks.find(t => t.id === taskId);
        if (task) {
            task.dueDate = newDueDate;
            saveTasksToLocalStorage();
            // Check if any tasks are now due.
            checkTasksDueDate();
        }
    }
}

/**
 * Request permission for displaying notifications.
 */
const requestNotificationPermission = () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        }
    });
}

/**
 * Check if any tasks are due and display notifications for them.
 */
const checkTasksDueDate = () => {
    const now = new Date().toISOString();
    tasks.forEach((categoryTasks, categoryId) => {
        categoryTasks.forEach(task => {
            if (task.dueDate && now >= task.dueDate && !task.notified) {
                showNotification(`Task Due: ${task.description}`, {
                    body: `Your task "${task.description}" is now due.`,
                    icon: '/styles/images/logo.svg'
                });
                // Prevent repeated notifications.
                task.notified = true;
            }
        });
    });
    // Save the update to prevent repeat notifications.
    saveTasksToLocalStorage();
}

/**
 * Display a notification.
 *
 * @param {string} title - The title of the notification.
 * @param {object} options - Additional options for the notification.
 */
const showNotification = (title, options) => {
    if (Notification.permission === "granted") {
        new Notification(title, options);
    }
}

/**
 * Edit the description of a task.
 *
 * @param {string} taskId - The ID of the task to edit.
 */
const editTask = (taskId) => {
    const currentTasks = tasks.get(activeCategoryId);
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
        const newDescription = prompt("Edit the task:", task.description);
        if (newDescription !== null && newDescription.trim() !== "") {
            task.description = newDescription.trim();
            saveTasksToLocalStorage();
            displayTasksForActiveCategory();
        }
    }
}

/**
 * Delete a task.
 *
 * @param {string} taskId - The ID of the task to delete.
 * @param {HTMLElement} listItem - The HTML element representing the task to delete.
 */
const deleteTask = (taskId, listItem) => {
    if (confirm("Are you sure you want to delete this task?")) {
        const currentTasks = tasks.get(activeCategoryId);
        const index = currentTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            // Remove the task from the array.
            currentTasks.splice(index, 1);
            tasks.set(activeCategoryId, currentTasks);
            saveTasksToLocalStorage();

            // Remove the task from the UI.
            listItem.remove();
        }
    }
}

/**
 * Search tasks based on the input value.
 */
const searchTasks = () => {
    const searchInput = document.getElementById("search-box").value.toLowerCase(); // Get the search input value and convert it to lowercase
    const taskList = document.getElementById("tasks-container");
    const completedTaskList = document.getElementById("completed-tasks-container");

    // Clear existing tasks from both task lists
    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    // Get the tasks for the active category
    const currentTasks = tasks.get(activeCategoryId) || [];

    // Filter tasks based on the search input
    const filteredTasks = currentTasks.filter(task => task.description.toLowerCase().includes(searchInput));

    // Display filtered tasks
    filteredTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "task";
        listItem.setAttribute('data-task-id', task.id);

        // Create task HTML based on completion status
        if (task.completed) {
            // HTML for completed tasks
            listItem.classList.add('completed');
            listItem.innerHTML = `
                <label class="checklabel" style="position: relative;">
                    <input type="checkbox" checked class="task-checkbox" style="display:none;">
                    <span class="checkmark" onclick="toggleCheck('${task.id}')" ${task.completed ? 'data-checked="true"' : ''}></span>
                    <span class="task-description completed">${task.description}</span>
                </label>
                <div class="action-items">
                    <!-- Include your action items here -->
                </div>
            `;
            completedTaskList.appendChild(listItem);
        } else {
            // HTML for incomplete tasks
            listItem.innerHTML = `
                <label class="checklabel" style="position: relative;">
                    <input type="checkbox" ${task.completed ? "checked" : ""} class="task-checkbox" style="display:none;">
                    <span class="checkmark" onclick="toggleCheck('${task.id}')" ${task.completed ? 'data-checked="true"' : ''}></span>
                    <span class="${task.completed ? "task-description completed" : "task-description"}">${task.description}</span>
                </label>
                <div class="action-items">
                    <!-- Include your action items here -->
                </div>
            `;
            taskList.appendChild(listItem);
        }
    });

    // Check if there are no tasks matching the search query
    if (filteredTasks.length === 0) {
        const noTaskAdded = document.getElementById('no-task-added');
        noTaskAdded.style.display = 'flex';
    } else {
        const noTaskAdded = document.getElementById('no-task-added');
        noTaskAdded.style.display = 'none';
    }

    // Check if there are completed tasks to display
    const completedDivider = document.getElementById("completed-divider");
    if (completedTaskList.children.length > 0) {
        completedDivider.style.display = "flex";
    } else {
        completedDivider.style.display = "none";
    }
}
