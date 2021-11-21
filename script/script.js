import {
    sanitizeText,
    getFormData,
    saveFormData,
    getRegister,
    searchData,
    deleteRegister,
} from "./register.js";

const formSearch = document.getElementById("form-search");

/**
 *
 * @param {Array<string>} string Crea nuevos elementos HTML.
 *
 * @returns {Array<HTMLElement>}
 */
const crearElementos = (...string) => {
    /** @type {Array<HTMLElement>} */
    const elements = [];

    string.forEach((element) => {
        elements.push(document.createElement(element));
    });

    return elements;
};

/**
 *
 * @param {string} selectorForm Debe seleccionar un formulario
 * mediante un selector.
 *
 * @return { void }
 */
const guardarCitas = (selectorForm) => {
    /** @type {HTMLFormElement} */
    const form = document.querySelector(selectorForm);

    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();

        swal.fire({
            title: "¿Seguro que quieres agendar la cita?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: "No guardar",
        }).then((result) => {
            if (result.isConfirmed) {
                saveFormData("citas", getFormData(form));
                pintarDatos("#table-container");
                swal.fire("Agenda guardada!", "", "success");
            } else if (result.isDenied) {
                swal.fire("Changes are not saved", "", "info");
            }
        });
    };
};

guardarCitas("#citas");

/**
 *
 * @param {string} selectorContainer Selector
 * @returns
 */
const pintarDatos = (selectorContainer) => {
    const tableContainer = document.querySelector(selectorContainer);
    if (!tableContainer) return;

    const register = getRegister("citas");
    tableContainer.textContent = "";

    const [table, thead, tbody, colgroup, col] = crearElementos(
        "table",
        "thead",
        "tbody",
        "colgroup",
        "col"
    );

    table.classList.add("table");
    thead.classList.add("table__thead");

    for (let i = 0; i < 5; i++) {
        const celda = col.cloneNode(false);
        colgroup.appendChild(celda);
    }

    // Cabecera de la tabla
    thead.insertAdjacentHTML(
        "beforeend",

        `<tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Sintomas</th>
            <th>Acciones</th>
        </tr>`
    );

    register.forEach((cita) => {
        const { id, nombre, fecha, hora, sintomas } = cita;

        tbody.insertAdjacentHTML(
            "beforeend",

            `<tr>
                <td>${nombre}</td>
                <td>${fecha}</td>
                <td>${hora}</td>
                <td>${sintomas}</td>
                <td><button data-id="${id}" class="btn btn-danger">Borrar</button></td>
            </tr>`
        );
    });

    table.append(colgroup, thead, tbody);
    tableContainer.appendChild(table);
};

pintarDatos("#table-container");

// Realizar búsqueda de datos:
formSearch?.addEventListener("submit", function (e) {
    e.preventDefault();

    const busqueda = document.querySelector("#busqueda");
    const input = this.elements.namedItem("buscar")?.value || "";
    if (!(input.length > 0) || !busqueda) return;

    const data = getRegister("citas");
    const filtrado = searchData(input, data);

    guardarCitas("#citas");

    busqueda.textContent = "";

    const [table, thead, tbody] = crearElementos("table", "thead", "tbody");

    table.append(thead, tbody);

    thead.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Síntomas</th>
            <th>Acciones</th>
        </tr>
        `
    );

    filtrado.length === 0
        ? (tbody.innerHTML = `<tr><td colspan="5">El nombre ${input} no existe</td></tr>`)
        : filtrado.forEach((cita) => {
              const { nombre, fecha, hora, sintomas } = cita;

              tbody.insertAdjacentHTML(
                  "beforeend",

                  `<tr>
                    <td>${nombre}</td>
                    <td>${fecha}</td>
                    <td>${hora}</td>
                    <td>${sintomas}</td>
                    <td><button data-id=${cita.id} class="btn btn-danger">Borrar</button></td>
                </tr>`
              );
          });

    thead.classList.add("table__thead");
    table.classList.add("table");
    busqueda.appendChild(table);
});

const resultados = document.querySelectorAll(".resultados");
resultados.forEach((resultado) => {
    resultado.addEventListener("click", function (e) {
        const target = e.target;
        const { id } = target.dataset;

        if (id) {
            deleteRegister(Number(id), "citas");
            target.parentNode.parentNode.remove();
            
            // Actualizar la vista de registro:
            pintarDatos("#table-container");
        }
    });
});
