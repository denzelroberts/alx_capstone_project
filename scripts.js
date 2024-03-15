//Displate Date
window.onload = function () {
    setInterval(function () {
        var date = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        var formattedDate = date.toLocaleDateString(undefined, options);
        document.getElementById('datetime').innerHTML = formattedDate;
    }, 1000); // 1000 milliseconds = 1 second
}

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

//Create Task declarations
const addTaskBox = document.getElementById("addTaskBox");
const taskList = document.getElementById("tasks-container");
const compTasklist = document.getElementById("completed-tasks-container");

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
        editButton.addEventListener("click", () => {
            if (labeltext.readOnly == true) {
                labeltext.removeAttribute("readonly");
                labeltext.focus();
                editButton.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
                
            }
            else {
                labeltext.setAttribute("readonly", "readonly");
                editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
                
            }
        });

        //Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        //Delete functionality
        deleteButton.addEventListener("click", () => {
            if(checkbox.checked){
                //if checkbox is checked delete from completed tasks container
                if (confirm("Are you sure you want to delete this task?")) {
                            compTasklist.removeChild(listItem);
                        }
            }else{
                //if checkbox is not checked, delete from to-do tasks area
                if (confirm("Are you sure you want to delete this task?")) {
                    taskList.removeChild(listItem);
                }
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
        checkbox.addEventListener("click", () => {
            if (checkbox.checked) {
                taskList.removeChild(listItem);
                duedateContainer.removeChild(duedateIcon);
                compTasklist.appendChild(listItem);
                
                //adding audio to completion
                const audio = document.getElementById("myAudio");
                audio.play();
            }
            else {
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

function createCategory() {
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
        const radioContainer = document.createElement("div");
        radioContainer.className = "radio-container";
        
        const radioItem = document.createElement("input");
        radioItem.type = "radio";
        radioItem.name = "category";
        radioItem.className = "custom-radio";
        radioItem.id = newCategoryId;
        
        const radioLabel = document.createElement("input");
        radioLabel.type = "text";
        radioLabel.className = "radio-label";
        radioLabel.value = categoryBox.value;
        radioLabel.setAttribute("readonly", "readonly");

        //Create edit button
        const editCategory = document.createElement("button");
        editCategory.className = "edit-button";
        editCategory.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        
        //edit functionality
        editCategory.addEventListener("click", () => {
            if (radioLabel.readOnly == true) {
                radioLabel.removeAttribute("readonly");
                radioLabel.focus();
                editCategory.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
            }
            else {
                radioLabel.setAttribute("readonly", "readonly");
                editCategory.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            }
        });

        //create delete button
        const delCategoryBtn = document.createElement("button");
        delCategoryBtn.className = "delete-button";
        delCategoryBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        //Delete functionality
        delCategoryBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this task?")) {
                categoryContainer.removeChild(radioContainer);
            }
        });

        //append children
        radioContainer.appendChild(radioItem);
        radioContainer.appendChild(radioLabel);

        //checks hidden radio button when the label is clicked and set the title of the App by category selected
        const categoryTitle = document.getElementById("category-title");
        radioLabel.addEventListener("click",()=>{
            radioItem.checked = "true";

            //Dynamic title
            categoryTitle.textContent = radioLabel.value;
        });

        //Setting Category title to Daily Tasks
        const defaultCategory = document.getElementById("default-category");
        defaultCategory.addEventListener("click", () => {
            categoryTitle.textContent = "My Daily Tasks";
        });

        radioContainer.appendChild(editCategory);
        radioContainer.appendChild(delCategoryBtn);

        categoryContainer.appendChild(radioContainer);
    }
    categoryBox.value = ""
}

//Hide sleeping image when task is created
function hideElementIfChildrenExist(containerId, elementId) {
    const container = document.getElementById(containerId);
    const elementToHide = document.getElementById(elementId);
    const compDivider = document.getElementById("completed-divider");

        if (container.children.length > 0) {
            elementToHide.style.display = "none";
            compDivider.style.display = "flex"
        }
}