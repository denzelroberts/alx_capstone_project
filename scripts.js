//Displate Date
window.onload = function() {
    setInterval(function() {
        var date = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        var formattedDate = date.toLocaleDateString(undefined, options);
        document.getElementById('datetime').innerHTML = formattedDate;
    }, 1000); // 1000 milliseconds = 1 second
}

//document.querySelector("label[for='dueDate']").addEventListener("click", DisplayDueDate);

//Add Task
const addTaskBox = document.getElementById("addTaskBox");
const taskList = document.getElementById("tasks-container");

function addTask(){
    if(addTaskBox.value == ""){
        alert("You must input a task");
    }
    else{
        //creating list item
        const listItem = document.createElement("li");
        listItem.className = "task";

        const label = document.createElement("label");
        label.className = "checklabel";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const span = document.createElement("span");
        span.className = "checkmark";

        const labeltext = document.createElement("span");
        labeltext.className = "label-text";
        labeltext.textContent = addTaskBox.value;

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
        duedateIcon.addEventListener("click",DisplayDueDate);

        //Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

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
        actionitems.appendChild(deleteButton);

        //Append items to row
        listItem.appendChild(label);
        listItem.appendChild(actionitems);

        //Append item to ul container
        taskList.appendChild(listItem);
    }
    addTaskBox.value = "";
}