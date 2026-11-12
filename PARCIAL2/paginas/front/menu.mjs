// ===========================================================================
// Menú principal compartido por las páginas privadas.
//
// Se inyecta en el <nav id="menu"> de cada página para no repetir el mismo
// HTML en todos los archivos. Los enlaces usan rutas absolutas porque las
// páginas están en subcarpetas distintas dentro de /app/.
// ===========================================================================

// Rutas absolutas: el menú se comparte entre páginas que están en
// subcarpetas distintas, por lo que un enlace relativo apuntaría a lugares
// diferentes según la página actual.
const ENLACES = [
    { href: '/app/items/items.html', texto: 'Ítems' },
    { href: '/app/procedimiento/procedimiento.html', texto: 'Procedimiento' },
    { href: '/cerrar-sesion', texto: 'Cerrar sesión' },
]

const menu = document.querySelector('#menu')

if (menu) {
    const lista = document.createElement('ul')

    for (const { href, texto } of ENLACES) {
        const elemento = document.createElement('li')
        const enlace = document.createElement('a')

        enlace.href = href
        enlace.textContent = texto

        // Marca visualmente la página actual (la resalta el CSS).
        if (window.location.pathname.endsWith(href)) {
            enlace.setAttribute('aria-current', 'page')
        }

        elemento.append(enlace)
        lista.append(elemento)
    }

    menu.append(lista)
}
