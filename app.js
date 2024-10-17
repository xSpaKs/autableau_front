// Query selectors

let div_classrooms = document.querySelector(".classrooms");
let class_form = document.querySelector(".class_form");
let class_list = document.querySelector(".classes_list");
let class_select = document.querySelector(".select_class");
let class_select_soutenance = document.querySelector(
    ".select_class_soutenance"
);
let class_none = document.querySelector(".class_none");
let class_error = document.querySelector(".class_error");
let classes_button = document.querySelector(".classes_button");

let div_students = document.querySelector(".students");
let student_form = document.querySelector(".student_form");
let students_list = document.querySelector(".students_list");
let student_none = document.querySelector(".student_none");
let student_class_error = document.querySelector(".student_class_error");
let student_error = document.querySelector(".student_error");
let students_button = document.querySelector(".students_button");

// Functions

async function getClassrooms() {
    const url = "http://localhost:5000/classrooms";
    try {
        const response = await fetch(url);
        const classrooms = await response.json();
        return classrooms;
    } catch (error) {
        console.error(error.message);
    }
}

async function getStudents(id) {
    const url = `http://localhost:5000/classrooms/${id}/students`;
    try {
        const response = await fetch(url);
        const classrooms = await response.json();
        return classrooms;
    } catch (error) {
        console.error(error.message);
    }
}

async function displayClassrooms(classrooms) {
    class_none.style.display = "none";
    class_list.innerHTML = "";
    class_select.innerHTML = `<option value="default">Choisissez une classe</option>`;
    class_select_soutenance.innerHTML = `<option value="default">Choisissez une classe</option>`;

    if (classrooms.length < 1) {
        class_none.style.display = "inline";
    } else {
        classrooms.forEach((_class) => {
            // List of classrooms
            let p = document.createElement("p");
            p.innerHTML = _class.name;

            let buttonModifier = document.createElement("button");
            buttonModifier.innerHTML = "Modifier";
            buttonModifier.addEventListener("click", () => {});

            let buttonSupprimer = document.createElement("button");
            buttonSupprimer.innerHTML = "Supprimer";
            buttonSupprimer.addEventListener("click", () => {
                deleteClassroom(_class.id);
            });

            let li = document.createElement("li");
            li.appendChild(p);
            li.appendChild(buttonModifier);
            li.appendChild(buttonSupprimer);
            class_list.appendChild(li);

            // Select options
            const option1 = document.createElement("option");
            option1.value = _class.id;
            option1.innerHTML = _class.name;
            class_select.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = _class.id;
            option2.innerHTML = _class.name;
            class_select.appendChild(option2);
            class_select_soutenance.appendChild(option2);
        });
    }
}

async function displayStudents(students) {
    student_none.style.display = "none";
    students_list.innerHTML = "";

    if (students.length < 1) {
        student_none.style.display = "inline";
    } else {
        students.forEach((student) => {
            // List of classrooms
            let p = document.createElement("p");
            p.innerHTML = student.name;

            let buttonModifier = document.createElement("button");
            buttonModifier.innerHTML = "Modifier";
            buttonModifier.addEventListener("click", () => {});

            let buttonSupprimer = document.createElement("button");
            buttonSupprimer.innerHTML = "Supprimer";
            buttonSupprimer.addEventListener("click", () => {
                deleteStudent(student.id);
            });

            let li = document.createElement("li");
            li.appendChild(p);
            li.appendChild(buttonModifier);
            li.appendChild(buttonSupprimer);
            students_list.appendChild(li);
        });
    }
}

async function loadClassrooms() {
    const classrooms = await getClassrooms();
    displayClassrooms(classrooms);
}

async function loadStudents() {
    const students = await getStudents(class_select.value);
    displayStudents(students);
}

async function addClassroom(classroom) {
    const url = "http://localhost:5000/classrooms";
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: classroom }),
        });
        const message = await response.json();
        console.log(message);

        await loadClassrooms();
    } catch (error) {
        console.log(error.message);
    }
}

async function addStudent(id, student) {
    const url = `http://localhost:5000/classrooms/${id}/students`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: student }),
        });
        const message = await response.json();
        console.log(message);

        await loadClassrooms();
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteClassroom(id) {
    const url = `http://localhost:5000/classrooms/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const message = await response.json();
        console.log(message);

        await loadClassrooms();
    } catch (error) {
        console.log(error.message);
    }
}

async function deleteStudent(class_id, student_id) {
    const url = `http://localhost:5000/classrooms/${class_id}/students/${student_id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const message = await response.json();
        console.log(message);

        await loadStudents();
    } catch (error) {
        console.log(error.message);
    }
}

async function editClassroom(id, name) {
    const url = `http://localhost:5000/classrooms/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const message = await response.json();
        console.log(message);
    } catch (error) {
        console.log(error.message);
    }
}

const toggleDisplay = (element, style) => {
    element.style.display = element.style.display === "none" ? style : "none";
};

// Event listeners

class_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const classroom = class_form.class_name.value.trim();
    if (classroom == "") {
        class_error.style.display = "inline";
        return;
    }

    class_error.style.display = "none";

    await addClassroom(classroom);
});

student_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const classroom = class_select.value;
    if (!Number.isInteger(parseInt(classroom, 10))) {
        student_class_error.style.display = "inline";
        return;
    }

    const student = student_form.student_name.value.trim();
    if (student == "") {
        student_error.style.display = "inline";
        return;
    }

    student_class_error.style.display = "none";
    student_error.style.display = "none";

    await addStudent(classroom);
});

classes_button.addEventListener("click", () => {
    toggleDisplay(div_classrooms, "block");
});

students_button.addEventListener("click", () => {
    toggleDisplay(div_students, "block");
});

class_select.addEventListener("change", async function () {
    if (class_select.value != "default") {
        await loadStudents();
        student_form.style.display = "flex";
    }
});

(async function main() {
    let classrooms = await getClassrooms();
    displayClassrooms(classrooms);
})();
