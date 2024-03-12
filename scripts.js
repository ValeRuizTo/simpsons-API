document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById('quote-container');
    const loadMoreButton = document.getElementById('load-more');
    const searchButton = document.getElementById('search-button');
    const characterInput = document.getElementById('character-input');

    async function fetchQuotes(count) {
        try {
            const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=${count}`);
            const data = await response.json();
            data.forEach(quoteData => {
                const { quote, character, image } = quoteData;
                const div = document.createElement('div');
                div.classList.add('character-box');
                div.innerHTML = `
                    <img src="${image}" alt="${character}">
                    <h2>${character}</h2>
                    <p>${quote}</p>
                `;
                container.appendChild(div);
            });
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    // Cargar 6 personajes al inicio
    await fetchQuotes(6);

    // Event listener para cargar más personajes al oprimir el botón
    loadMoreButton.addEventListener('click', async function() {
        await fetchQuotes(6); // Cargar 6 personajes adicionales
    });

    // Event listener para cargar citas por personaje al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', async function() {
        const character = characterInput.value.trim();
        if (character) {
            try {
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?character=${character}`);
                const data = await response.json();
                container.innerHTML = ''; // Limpiar citas anteriores
                data.forEach(quoteData => {
                    const { quote, character, image } = quoteData;
                    const div = document.createElement('div');
                    div.classList.add('character-box');
                    div.innerHTML = `
                        <img src="${image}" alt="${character}">
                        <h2>${character}</h2>
                        <p>${quote}</p>
                    `;
                    container.appendChild(div);
                });
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
    });
});
