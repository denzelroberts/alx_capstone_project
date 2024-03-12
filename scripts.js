//Displate Date
window.onload = function() {
    setInterval(function() {
        var date = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        var formattedDate = date.toLocaleDateString(undefined, options);
        document.getElementById('datetime').innerHTML = formattedDate;
    }, 1000); // 1000 milliseconds = 1 second
}

function DisplayDueDate() {
    const duedate = document.getElementById("dueDate");
    if (duedate.style.display === "none") {
        duedate.style.display = "block"; // Show the datepicker
    } else {
        duedate.style.display = "none"; // Hide the datepicker again
    }
}

document.querySelector("label[for='dueDate']").addEventListener("click", DisplayDueDate);

//Add Task
const addTaskBox = document.getElementById("addTaskBox");
const tasks = document.getElementById('tasks');



function addTask(){
    alert("You must input a task");
}

document.getElementById('add-btn').addEventListener("click", addTask);