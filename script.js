document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual
    setCurrentDate();
    
    // Cargar productos
    loadProductos();
    
    // Configurar botón de impresión
    document.getElementById('printButton').addEventListener('click', printCatalog);
});

function setCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    document.getElementById('currentDate').textContent = `${dd}/${mm}/${yyyy}`;
}

async function loadProductos() {
    try {
        // Simulación de datos - Reemplazar con tu API real
        const productos = [
            {
                descripcion: "Producto de ejemplo",
                codigo: "001",
                precio: 199.99,
                existencias: 10,
                imagen: "https://via.placeholder.com/460x345"
            }
            // Agregar más productos aquí
        ];
        
        renderProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        document.getElementById('productos').innerHTML = '<div class="error">Error al cargar productos</div>';
    }
}

function renderProductos(productos) {
    const container = document.getElementById('productos');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div class="error">No se encontraron productos con existencias</div>';
        return;
    }

    const productosHTML = productos
        .map(producto => `
            <div class="producto">
                <img src="${producto.imagen}" 
                     alt="${producto.descripcion}"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
                <h3>${producto.descripcion}</h3>
                <p>CÓDIGO: ${producto.codigo}</p>
                <p class="precio">PRECIO: Q ${typeof producto.precio === 'number' ? producto.precio.toFixed(2) : '0.00'}</p>
                <p class="existencias">EXISTENCIAS: ${producto.existencias}</p>
            </div>
        `)
        .join('');

    container.innerHTML = productosHTML;
}

async function printCatalog() {
    const button = document.getElementById('printButton');
    const originalText = button.textContent;
    
    try {
        button.disabled = true;
        button.textContent = 'Generando PDF (puede tardar 1-2 minutos)...';
        
        const element = document.body;
        const opt = {
            margin: [10, 10],
            filename: `catalogo-wes-${getCurrentDate()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: true,
                useCORS: true
            },
            jsPDF: { 
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        await html2pdf().set(opt).from(element).save();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar el PDF. Por favor intente nuevamente.');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}
