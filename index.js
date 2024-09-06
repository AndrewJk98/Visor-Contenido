import {data} from './data/datos_c3.js';

// Función recursiva para contar contenidos que no sean del tipo "DIRECTORY"
const contarContenidos = (nodos) => {
    let contador = 0;

    nodos.forEach(nodo => {
        // Si el tipo no es "DIRECTORY", incrementar el contador
        if (nodo.type !== "DIRECTORY") {
            contador++;
        }

        // Si el nodo tiene subnodos, realizar la recursión
        if (nodo.nodes && nodo.nodes.length > 0) {
            contador += contarContenidos(nodo.nodes);
        }
    });

    return contador;
};

// Función para crear un elemento 'th' con texto
const crearTH = (texto) => {
    const th = document.createElement('th');
    th.textContent = texto;
    return th;
};

// Función para crear una celda 'td' con atributos comunes
const crearTD = (contenido, targetId) => {
    const td = document.createElement('td');
    td.textContent = contenido;
    td.classList.add('collapsed');
    td.setAttribute("data-bs-toggle", "collapse");
    td.setAttribute("data-bs-target", `#flush-collapse-${targetId}`);
    td.setAttribute("aria-expanded", "false");
    td.setAttribute("aria-controls", `flush-collapse-${targetId}`);
    return td;
};

// Función para alternar la creación o eliminación de nodos hijos recursivamente
const toggleNodosHijos = (tr_padre, cant_tds, id_padre, subnodos) => {
    const existingTr = document.getElementById(`flush-collapse-${id_padre}`);
    
    // Si los nodos hijos ya existen, eliminarlos
    if (existingTr) {
        existingTr.remove();
        return; // Salir de la función
    }

    // Si no existen, crearlos
    const trContainer = document.createElement('tr');
    trContainer.id = `flush-collapse-${id_padre}`;
    trContainer.classList.add('accordion-collapse', 'show');
    
    const tdContainer = document.createElement('td');
    tdContainer.classList.add('accordion-body');
    tdContainer.colSpan = cant_tds;

    const table = document.createElement('table');
    table.classList.add("table", "border", "mb-0");

    const thead = document.createElement('thead');
    thead.classList.add('table-dark');
    
    const trhead = document.createElement('tr');
    const theadArray = ["Nombre", "Tipo", "Cantidad de Subcarpetas", "Total de Contenidos"];
    theadArray.forEach(t => trhead.appendChild(crearTH(t)));
    
    thead.appendChild(trhead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    subnodos.forEach(nodo => {
        const tr = document.createElement('tr');
        tr.id = nodo._id;
        tr.classList.add('accordion-item', 'collapsed');

        const td_name = crearTD(nodo.name, nodo._id);
        const td_type = crearTD(nodo.type, nodo._id);

        const td_qnty_fold = crearTD(
            nodo.type === "DIRECTORY" ? nodo.nodes.length : "-", 
            nodo._id
        );
        
        const td_ttl_content = crearTD(
            nodo.type === "DIRECTORY" ? contarContenidos(nodo.nodes) : "-", 
            nodo._id
        );

        tr.appendChild(td_name);
        tr.appendChild(td_type);
        tr.appendChild(td_qnty_fold);
        tr.appendChild(td_ttl_content);

        tbody.appendChild(tr);

        // Verificar si el nodo tiene hijos y agregar un event listener recursivo
        if (nodo.nodes && nodo.nodes.length > 0) {
            tr.addEventListener('click', () => {
                toggleNodosHijos(tr, 4, nodo._id, nodo.nodes);
            });
        }
    });

    table.appendChild(tbody);
    tdContainer.appendChild(table);
    trContainer.appendChild(tdContainer);

    // Insertar el nuevo tr justo después del tr padre
    tr_padre.parentNode.insertBefore(trContainer, tr_padre.nextSibling);
};

// Crear las filas principales
const table_body = document.getElementById('table_body');
data.forEach(d => {
    const tr = document.createElement('tr');
    tr.id = d._id;
    tr.classList.add('accordion-item');

    const td_name = crearTD(d.name, d._id);

    const td_qnty_fold = crearTD(
        d.nodes.length, 
        d._id
    );

    const td_ttl_content = crearTD(
        contarContenidos(d.nodes), 
        d._id
    );

    tr.appendChild(td_name);
    tr.appendChild(td_qnty_fold);
    tr.appendChild(td_ttl_content);
    
    const cant_tds = tr.getElementsByTagName("td").length;

    // Añadir el event listener para alternar los nodos hijos al hacer clic
    tr.addEventListener('click', () => {
        toggleNodosHijos(tr, cant_tds, d._id, d.nodes);
    });

    table_body.appendChild(tr);
});
