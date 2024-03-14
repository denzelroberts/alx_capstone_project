//Displate Date
window.onload = function () {
    setInterval(function () {
        var date = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        var formattedDate = date.toLocaleDateString(undefined, options);
        document.getElementById('datetime').innerHTML = formattedDate;
    }, 1000); // 1000 milliseconds = 1 second
}

//document.querySelector("label[for='dueDate']").addEventListener("click", DisplayDueDate);

//Add Task
const addTaskBox = document.getElementById("addTaskBox");
const taskList = document.getElementById("tasks-container");
const compTasklist = document.getElementById("completed-tasks-container");

//Creating a function to create task IDs incrementally
let taskIdCounter = 0;

function createTaskId() {
    taskIdCounter++;
    return `TASK-${taskIdCounter}`;
}

//Creating a function to create category IDs incrementally
let categoryIdCounter = 0;

function createCategoryId() {
    categoryIdCounter++;
    return `CATEGORY-${categoryIdCounter}`;
}

//Remove no-task-added div when there are tasks
// if(x){
//     const removeNoAddedTask = document.getElementById("no-task-added");
//     removeNoAddedTask.document.display.style = "none";
// }

//Function to create task
function addTask() {
    if (addTaskBox.value == "") {
        alert("You must input a task");
        return;
    }
    else {
        //Creating task ID
        const newTaskId = createTaskId();
        //later store this somewhere
        console.log(`New task ID: ${newTaskId}`);

        //creating list item
        const listItem = document.createElement("li");
        listItem.className = "task";

        const label = document.createElement("label");
        label.className = "checklabel";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "default";

        const span = document.createElement("span");
        span.className = "checkmark";

        const labeltext = document.createElement("input");
        labeltext.type = "text";
        labeltext.className = "label-text";
        labeltext.value = addTaskBox.value;
        labeltext.setAttribute("readonly", "readonly");

        const actionitems = document.createElement("div");
        actionitems.className = "action-items";

        const urgency = document.createElement("select");
        urgency.className = "drop-down";

        // Create urgency options
        const option1 = new Option("Urgency", "0");
        option1.selected = true;
        option1.disabled = true;
        const option2 = new Option("Low", "low");
        const option3 = new Option("Normal", "normal");
        const option4 = new Option("High", "high");

        // Add options to the urgency
        urgency.add(option1);
        urgency.add(option2);
        urgency.add(option3);
        urgency.add(option4);

        //Create date picker container
        const duedateContainer = document.createElement("div");
        duedateContainer.className = "duedate";

        //Create date icon
        const duedateIcon = document.createElement("label");
        duedateIcon.className = "secondary-button";
        duedateIcon.innerHTML = `<i class="fa-solid fa-clock"></i>`;

        //Creating date picker
        const datepicker = document.createElement("input");
        datepicker.type = "datetime-local"
        datepicker.className = "datepicker";
        datepicker.id = "datepicker";

        //A function to toggle datepicker
        function DisplayDueDate() {
            const duedate = document.getElementById("datepicker");
            if (duedate.style.display === "none") {
                duedate.style.display = "block"; // Show the datepicker
            } else {
                duedate.style.display = "none"; // Hide the datepicker again
            }
        }
        duedateIcon.addEventListener("click", DisplayDueDate);

        //Create edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

        //Edit functionality
        editButton.addEventListener("click", () =>{
            if(labeltext.readOnly == true){
                labeltext.removeAttribute("readonly");
                labeltext.focus();
                editButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
            }
            else{
                labeltext.setAttribute("readonly","readonly");
                editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            }
        });

        //Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        //Delete functionality
        deleteButton.addEventListener("click", () =>{
            if(confirm("Are you sure you want to delete this task?")){
                taskList.removeChild(listItem);
            }
        });

        //Append items to label tag
        label.appendChild(checkbox);
        label.appendChild(span);
        label.appendChild(labeltext);

        //Append items to datepicker
        duedateContainer.appendChild(duedateIcon);
        duedateContainer.appendChild(datepicker);

        //Append items to actionitems div
        actionitems.appendChild(urgency);
        actionitems.appendChild(duedateContainer);
        actionitems.appendChild(editButton);
        actionitems.appendChild(deleteButton);

        //Append items to row
        listItem.appendChild(label);
        listItem.appendChild(actionitems);

        //Append item to ul container
        taskList.appendChild(listItem);
        hideElementIfChildrenExist("tasks-container", "no-task-added");

        //Moving item to completed container when checked
        checkbox.addEventListener("click", () =>{
            if(checkbox.checked){
                taskList.removeChild(listItem);
                duedateContainer.removeChild(duedateIcon);
                compTasklist.appendChild(listItem);
            }
            else{
                compTasklist.removeChild(listItem);
                duedateContainer.appendChild(duedateIcon);
                taskList.appendChild(listItem);
            }
        });
    }
    addTaskBox.value = "";
}

//creating category
const categoryBox = document.getElementById("categoryBox");
const categoryContainer = document.getElementById("categoryContainer");

function createCategory(){
    if (categoryBox.value == "") {
        alert("You must input a category");
        return;
    }
    else {
        //Creating category ID
        const newCategoryId = createCategoryId();
        //later store this somewhere
        console.log(`New category ID: ${newCategoryId}`);

        //creating elements
        const listItem = document.createElement("li");

        const linkItem = document.createElement("a");
        linkItem.className = "selected-link";
        linkItem.href = "#";
        linkItem.textContent = categoryBox.value;

        const delCategoryBtn = document.createElement("button");
        delCategoryBtn.className = "delete-button";
        delCategoryBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        //Delete functionality
        delCategoryBtn.addEventListener("click", () =>{
            if(confirm("Are you sure you want to delete this task?")){
                categoryContainer.removeChild(listItem);
            }
        });

        //append children
        listItem.appendChild(linkItem);
        listItem.appendChild(delCategoryBtn);

        categoryContainer.appendChild(listItem);
    }
    categoryBox.value = ""
}

function hideElementIfChildrenExist(containerId, elementId) {
    const container = document.getElementById(containerId);
    const elementToHide = document.getElementById(elementId);

    if (container && elementToHide) {
        // Check if the container has any child elements
        if (container.children.length > 0) {
            // Set the display of the specified element to "none"
            elementToHide.style.display = "none";
        }
    }
}
