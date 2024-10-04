// Función para cargar alumnos desde localStorage
function cargarAlumnos() {
    return JSON.parse(localStorage.getItem('alumnos')) || [];
}

// Función para guardar alumnos en localStorage
function guardarAlumnos(alumnos) {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

// Función para añadir un alumno
function añadirAlumno(nombre) {
    const alumnos = cargarAlumnos();
    const nuevoAlumno = {
        id: Date.now(),
        nombre: nombre,
        fecha: new Date().toLocaleString()
    };
    alumnos.push(nuevoAlumno);
    guardarAlumnos(alumnos);
    actualizarTabla();
}

// Función para eliminar un alumno
function eliminarAlumno(id) {
    let alumnos = cargarAlumnos();
    alumnos = alumnos.filter(alumno => alumno.id !== id);
    guardarAlumnos(alumnos);
    actualizarTabla();
}

// Función para modificar la fecha de un alumno
function modificarFecha(id, nuevaFecha) {
    if (nuevaFecha) {
        const alumnos = cargarAlumnos();
        const alumno = alumnos.find(alumno => alumno.id === id);
        if (alumno) {
            alumno.fecha = new Date(nuevaFecha).toLocaleString();
            guardarAlumnos(alumnos);
            actualizarTabla();
        }
    }
}


// Función para actualizar la tabla
function actualizarTabla() {
    const alumnos = cargarAlumnos();
    alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const tbody = document.querySelector('#tablaAlumnos tbody');
    tbody.innerHTML = '';

    alumnos.forEach(alumno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.fecha}</td>
            <td><button class="delete-btn" onclick="eliminarAlumno(${alumno.id})">Eliminar</button></td>
            <td>
                <input type="date" class="nuevaFecha" />
                <button class="modificar-btn" onclick="modificarFecha(${alumno.id}, document.querySelector('.nuevaFecha').value)">Modificar fecha</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para descargar datos como archivo JSON
function descargarDatos() {
    const alumnos = cargarAlumnos();
    alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alumnos, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "alumnos.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Función para descargar datos como archivo PDF
function descargarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const alumnos = cargarAlumnos();

    alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    doc.text("Lista de Alumnos", 20, 10);
    
    let yPos = 20;
    alumnos.forEach((alumno, index) => {
        doc.text(`${index + 1}. ${alumno.nombre} - ${alumno.fecha}`, 20, yPos);
        yPos += 10;

        if (yPos >= 280) {
            doc.addPage();
            yPos = 20;
        }
    });

    doc.save("Listado de alumnos.pdf");
}

// Event listener para el formulario
document.getElementById('alumnoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombreAlumno').value;
    if (nombre) {
        añadirAlumno(nombre);
        document.getElementById('nombreAlumno').value = '';
    }
});

// Event listener para el botón de descarga JSON
document.getElementById('descargarDatos').addEventListener('click', descargarDatos);

// Event listener para el botón de descarga PDF
document.getElementById('descargarPDF').addEventListener('click', descargarPDF);

// Inicializar la tabla al cargar la página
actualizarTabla();