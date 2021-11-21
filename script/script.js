import {
    sanitizeText,
    getFormData,
    saveFormData,
    getRegister,
    searchData,
    deleteRegister
} from "./register.js";

const form = document.querySelector("form");
const listarCitas = document.getElementById("listarCitas");
const citas = [];
const formSearch = document.getElementById("form-search");
const busqueda = document.getElementById("busqueda");

console.log(getRegister("citas"));


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

    if ( !form ) return;

    form.onsubmit = (e) => {
        e.preventDefault();

        swal.fire({
            title: "¿Seguro que quieres agendar la cita?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: 'No guardar',
        }).then((result) => {
            if (result.isConfirmed) {
                saveFormData("citas", getFormData(form));                
                pintarDatos("#listaCitas");
                swal.fire("Agenda guardada!", "", "success");
            } else if (result.isDenied) {
                swal.fire("Changes are not saved", "", "info");
            }
        });
    }
};

guardarCitas("#citas");

citas.push(...getRegister("citas"));

/**
 * 
 * @param {string} selector Selector
 * @returns 
 */
const pintarDatos = (selector) => {
    const listarCitas = document.querySelector(selector);
    if (!listarCitas) return;

    const register = getRegister("citas");

    register.forEach(cita => {
        const { nombre, fecha, hora, sintomas } = cita;
        const registro = `
        <tr>\n
            <td>${nombre}</td>\n
            <td>${fecha}</td>\n
            <td>${hora}</td>\n
            <td>${sintomas}</td>\n
        <tr>\n`;

        listarCitas.insertAdjacentHTML('beforeend', registro);
    });
};

pintarDatos("#listarCitas");

formSearch?.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = getRegister("citas");
    const input = this.elements.namedItem("buscar")?.value || "";
    const filtrado = searchData(input, data);

    console.log( filtrado );

    busqueda.textContent = "";

    filtrado.length === 0
        ? (busqueda.innerHTML += `<div>El nombre ${input} no existe</div>`)
        : filtrado.map((cita) => {
            const { nombre, fecha, hora, sintomas } = cita;
            busqueda.innerHTML += `
            <div>
                <div>${nombre}</div>
                <div>${fecha}</div>
                <div>${hora}</div>
                <div>${sintomas}
                <button>Borrar</button>
            </div>
            `;
        });
});