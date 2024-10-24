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

let soutenance_form = document.querySelector(".soutenance_form");
let soutenance_already_error = document.querySelector(
    ".soutenance_already_error"
);
let soutenance_class_error = document.querySelector(".soutenance_class_error");
let soutenance_name_error = document.querySelector(".soutenance_name_error");

let run_soutenance_title = document.querySelector(".run_soutenance_title");
let run_soutenance_current = document.querySelector(".run_soutenance_current");
let run_soutenance_total = document.querySelector(".run_soutenance_total");
let run_soutenance_done = document.querySelector(".run_soutenance_done");
let run_soutenance_left = document.querySelector(".run_soutenance_left");

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
            let input = document.createElement("input");
            input.type = "text";
            input.value = _class.name;

            let buttonModifier = document.createElement("button");
            buttonModifier.innerHTML = "Modifier";
            buttonModifier.addEventListener("click", (e) => {
                editClassroom(e, _class.id, input.value);
            });

            let buttonSupprimer = document.createElement("button");
            buttonSupprimer.innerHTML = "Supprimer";
            buttonSupprimer.addEventListener("click", () => {
                deleteClassroom(_class.id);
            });

            let errorModifier = document.createElement("p");

            let li = document.createElement("li");
            li.appendChild(input);
            li.appendChild(buttonModifier);
            li.appendChild(buttonSupprimer);
            class_list.appendChild(li);
            class_list.appendChild(errorModifier);

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
            let input = document.createElement("input");
            input.type = "text";
            input.value = student.name;

            let buttonModifier = document.createElement("button");
            buttonModifier.innerHTML = "Modifier";
            buttonModifier.addEventListener("click", (e) => {
                editStudents(e, class_select.value, student.id, input.value);
            });

            let buttonSupprimer = document.createElement("button");
            buttonSupprimer.innerHTML = "Supprimer";
            buttonSupprimer.addEventListener("click", () => {
                deleteStudent(class_select.value, student.id);
            });

            let errorModifier = document.createElement("p");
            let li = document.createElement("li");
            li.appendChild(input);
            li.appendChild(buttonModifier);
            li.appendChild(buttonSupprimer);
            students_list.appendChild(li);
            students_list.appendChild(errorModifier);
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

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error(
                    "Il ne peut y avoir 2 classes ayant le même nom"
                );
            }
        }

        const message = await response.json();
        console.log(message);

        await loadClassrooms();
    } catch (error) {
        class_error.style.display = "inline";
        class_error.textContent = error.message;
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

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error(
                    "Il ne peut y avoir 2 étudiants ayant le même nom dans la même classe"
                );
            }
        }

        const message = await response.json();
        console.log(message);

        await loadStudents();
        student_form.student_name.value = "";
    } catch (error) {
        student_error.style.display = "inline";
        student_error.textContent = error.message;
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

async function editClassroom(e, id, name) {
    let hasError = false;
    e.target.parentNode.nextSibling.textContent = "";

    if (name == "") {
        e.target.parentNode.nextSibling.style.display = "block";
        e.target.parentNode.nextSibling.textContent =
            "Le nom de la classe est obligatoire";
        hasError = true;
    }

    const classrooms = await getClassrooms();
    classrooms.forEach((element) => {
        if (element.name == name) {
            e.target.parentNode.nextSibling.style.display = "block";
            e.target.parentNode.nextSibling.textContent =
                "Cette classe existe déjà";
            hasError = true;
        }
    });

    if (hasError == false) {
        const url = `http://localhost:5000/classrooms/${id}`;
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name }),
            });

            const message = await response.json();
            console.log(message);

            await loadClassrooms();
        } catch (error) {
            console.log(error.message);
        }
    }
}

async function editStudents(e, classroom_id, student_id, name) {
    let hasError = false;
    e.target.parentNode.nextSibling.textContent = "";

    if (name == "") {
        e.target.parentNode.nextSibling.style.display = "block";
        e.target.parentNode.nextSibling.textContent =
            "Le nom de l'étudiant est obligatoire";
        hasError = true;
    }

    const students = await getStudents(classroom_id);
    students.forEach((element) => {
        if (element.name == name) {
            e.target.parentNode.nextSibling.style.display = "block";
            e.target.parentNode.nextSibling.textContent =
                "Il ne peut y avoir 2 étudiants ayant le même nom dans la même classe";
            hasError = true;
        }
    });

    if (hasError == false) {
        const url = `http://localhost:5000/classrooms/${classroom_id}/students/${student_id}`;
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name }),
            });

            const message = await response.json();
            console.log(message);

            await loadClassrooms();
        } catch (error) {
            console.log(error.message);
        }
    }
}

const toggleDisplay = (element, style) => {
    element.style.display = element.style.display === "none" ? style : "none";
};

const runSoutenance = () => {
    div_classrooms.style.display = "none";
    div_students.style.display = "none";

    const name = localStorage.getItem("name");
    const students = JSON.parse(localStorage.getItem("students"));
    const students_total = students.length;
    let students_done = 0;
    let students_left = students_total;

    run_soutenance_title.textContent = "Soutenance en cours : " + name;
    run_soutenance_total.textContent = students_total + " étudiants";
    run_soutenance_left.textContent = students_left + " restants";
    run_soutenance_done.textContent = students_done + " sont déja passés";

    const intervalId = setInterval(() => {
        if (students.length === 0) {
            run_soutenance_current.textContent =
                "Tous les étudiants sont passés.";
            clearInterval(intervalId);
            return;
        }

        students_done += 1;
        students_left -= 1;
        const student = students.sort((a, b) => 0.5 - Math.random()).shift();
        run_soutenance_current.textContent =
            student.name + " est en train de passer au tableau";

        run_soutenance_left.textContent = students_left + " restants";
        run_soutenance_done.textContent = students_done + " sont déja passés";

        localStorage.setItem("students", JSON.stringify(students));
    }, 3000);
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
        student_error.textContent = "Veuillez ajouter un nom à l'étudiant";
        return;
    }

    student_class_error.style.display = "none";
    student_error.style.display = "none";

    await addStudent(classroom, student);
});

soutenance_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    soutenance_class_error.style.display = "none";
    soutenance_name_error.style.display = "none";

    const classroom_id = class_select_soutenance.value;
    const soutenance_name = soutenance_form.name.value;
    let hasError = false;

    let soutenance = JSON.parse(localStorage.getItem("student"));
    if (soutenance != null) {
        if (soutenance.length > 0) {
            soutenance_already_error.style.display = "block";
            return;
        }
    }

    if (!Number.isInteger(parseInt(classroom_id, 10))) {
        soutenance_class_error.style.display = "block";
        hasError = true;
    }

    if (soutenance_name == "") {
        soutenance_name_error.style.display = "block";
        hasError = true;
    }

    if (hasError == true) {
        return;
    }

    const students = await getStudents(classroom_id);

    if (students.length > 0) {
        localStorage.setItem("name", soutenance_name);
        localStorage.setItem("students", JSON.stringify(students));
        runSoutenance();
    }
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
    } else {
        students_list.innerHTML = "";
    }
});

(async function main() {
    let classrooms = await getClassrooms();
    displayClassrooms(classrooms);

    let soutenance = JSON.parse(localStorage.getItem("student"));

    if (soutenance != null) {
        if (JSON.parse(localStorage.getItem("students")).length > 0) {
            runSoutenance();
        }
    }
})();
