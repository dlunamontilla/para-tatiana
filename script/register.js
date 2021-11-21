// @ts-check

/**
 * 
 * @param {any} input Evalur si es o no un campo de formulario.
 * 
 * @returns { boolean }
 */
function isInput(input) {
    return Object.prototype.toString.call(input) === "[object HTMLInputElement]";
}

/**
 *
 * @param {string|number} text Ingrese un texto para sanearlo.
 *
 * @returns { string } Devuelve un texto saneado y codificado.
 */
function sanitizeText(text) {
    const pattern = /[<>]/gi;
    const replace = {
        "<": "&lt;",
        ">": "&gt;",
    };

    text = String(text).replace(pattern, (string) => {
        return replace[string];
    });

    return text;
}

/**
 *
 * @param {HTMLFormElement} form Coloque su formulario
 * como parámetro de getDataForm para capturar sus datos
 * y devolver un objeto.
 *
 * @return { Object<string, string|number>} Devuelve un
 * objeto con los datos capturados del formulario. Esto lo
 * hace de forma automática sin necesidad de saberse los
 * campos del formulario. El único requisito es que dichos
 * campos del formulario deban tener el atributo «name» para
 * que sus datos sean capturados.
 *
 */
function getFormData(form) {
    /** @type { Object<string, string|number> } */
    const data = {};

    for (let field of form.elements) {
        const radio = field["type"];

        if (!("name" in field))
            continue;
        if (radio === "radio" && !radio.checked)
            continue;
        if (!(field["name"].length > 0))
            continue;

        data[field["name"]] = sanitizeText(field["value"].trim());
    }

    // Limpiar los datos del formulario
    form.reset();

    return data;
}

/**
 *
 * Esta función guarda los datos del formulario en localStorge.
 * 
 * @param { string } nameRegister Nombre del registro a
 * guardar en el navegador.
 *
 * @param {Object<string, string|number> } dataForm
 * Debe pasar como parámetro el objeto devuelto por el formulario
 * para guardar los datos en localStorage. Se guardarán como un
 * Array de objetos.
 *
 * @returns { void }
 */
function saveFormData(nameRegister, dataForm) {
    const register = localStorage.getItem(nameRegister);
    const data = [];

    // Si los datos en localStorage existen se recuperarán
    // y se enviarán a _data[]:
    if (register) {
        data.push(...JSON.parse(register));
    }

    data.push({id: data.length + 1, ...dataForm});

    localStorage.setItem(nameRegister, JSON.stringify(data));
}

/**
 *
 * @param {string} nameRegister Ingrese el nombre de registro
 * previamente almacenado.
 *
 * @returns { Array<Object<string, string|number>> }
 * Devuelve un Array vacío en el caso de no existir el
 * registro solicitado.
 */
function getRegister(nameRegister) {
    const data = localStorage.getItem(nameRegister);
    return data ? JSON.parse(data) : [];
}

/**
 *
 * @param { string } inputText Ingrese un criterio de búsqueda
 * para filtrar los datos.
 *
 * @param {Array<Object<string, string|number>>} data Se
 * pasar como parámetro un Array de objetos para filtrarlos.
 *
 * @return { Array<Object<string, string|number>> }
 */
function searchData(inputText, data) {
    const pattern = /[\+\*\?\^\$\.\[\]\{\}\(\)\|\/]/g;

    inputText = inputText.replace(pattern, (string, a, b) => {
        return `\\${string}`;
    });

    const findName = new RegExp(`${inputText || "()"}+`, "gi");

    console.log(findName);

    return data.filter((object) => {
        for (let property in object) {
            const value = object[property];
            if (findName.test(String(value)))
                return true;
        }
    }, []);
}

/**
 * 
 * @param {number} id Debe ingresar el ID del registro para seleccionarlo
 * y eliminarlo.
 * 
 * @param {string} nameRegister Seleccione el nombre de registro almacenado
 * en localStorage.
 * 
 * @return { void }
 */
function deleteRegister(id, nameRegister) {
    const data = getRegister(nameRegister);
    const dataFiltered = data.filter(object => object.id !== id);
    localStorage.setItem(nameRegister, JSON.stringify(dataFiltered));
}

export {
    sanitizeText,
    getFormData,
    saveFormData,
    getRegister,
    searchData,
    deleteRegister
}