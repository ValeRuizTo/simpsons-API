document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById('quote-container');
    const loadMoreButton = document.getElementById('load-more');
    const searchButton = document.getElementById('search-button');
    const characterInput = document.getElementById('character-input');
    const quoteInput = document.getElementById('quote-count-input');
    const characterInput2 = document.getElementById('character');
    const quoteButton = document.getElementById('quote-button');
    const BackButton = document.getElementById('back-button');
    const spinner = document.getElementById('html-spinner');
    const loadNew = document.getElementById('load-new');


    
    let isFirstLoad = true;
    let currentCharacter = '';
    let allQuotes = []; // Array para almacenar todas las citas disponibles para el personaje
    let shownQuotes = []; // Array para almacenar las citas ya mostradas
    

    loadNew.style.display = 'none';
    async function fetchQuotes(count) {
        try {
            BackButton.style.display = 'none';
            loadMoreButton.style.display = 'none'; 
            if (isFirstLoad) {
                spinner.style.display = 'block'; // Mostrar el spinner solo en la primera carga
                isFirstLoad = false; // Cambiar la bandera después de la primera carga
            }
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
        finally {
            spinner.style.display = 'none'; // Ocultar el spinner una vez cargados los datos
            loadMoreButton.style.display = 'inline-block'; 

        }
    }
    
    // Cargar 6 personajes al inicio
    await fetchQuotes(6);

    // Event listener para cargar más personajes al oprimir el botón
    loadMoreButton.addEventListener('click', async function() {
        await fetchQuotes(6); // Cargar 6 personajes adicionales
    });

    // Event listener para cargar citas por personaje al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', async ()=>{
        const character = characterInput.value.trim();
        loadMoreButton.style.display = 'none'; 
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
                BackButton.style.display = 'inline-block'; // Mostrar el botón extra

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
            characterInput.value = ''; // Limpiar el campo de texto después de buscar
        }
    });
        
    // Event listener para cargar citas por personaje y número de citas
    quoteButton.addEventListener('click', async () => {
        const character2 = characterInput2.value.trim();
        const quotes = quoteInput.value.trim();
        loadNew.style.display = 'none'; // Ocultar el botón loadNew al buscar nuevas citas
        loadMoreButton.style.display = 'none'; 

        if (character2 && quotes) {
            currentCharacter = character2;
            try {
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=${quotes}&character=${character2}`);
                const data = await response.json();
                container.innerHTML = ''; // Limpiar citas anteriores
                allQuotes = data; // Almacenar todas las citas disponibles
                shownQuotes = []; // Reiniciar el array de citas mostradas

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
                    shownQuotes.push(quote); // Agregar cita al array de citas mostradas
                    console.log(shownQuotes);
                });
                // Mostrar el botón loadNew solo después de cargar las citas iniciales
                loadNew.style.display = 'inline-block'; 
                BackButton.style.display = 'inline-block'; // Ocultar el botón extra

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
            characterInput2.value = ''; // Limpiar el campo de texto después de buscar
            quoteInput.value = ''; // Limpiar el campo de texto después de buscar
        }
    });
        
    loadNew.addEventListener('click', async () => {
        if (currentCharacter) {
            try {
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=15&character=${currentCharacter}`);
                const data = await response.json();
                console.log(data);
                data.forEach(quoteData => {
                    const { quote } = quoteData;
                    if (!shownQuotes.includes(quote)) {
                        const { character, image } = quoteData;
                        const div = document.createElement('div');
                        div.classList.add('character-box');
                        div.innerHTML = `
                            <img src="${image}" alt="${character}">
                            <h2>${character}</h2>
                            <p>${quote}</p>
                        `;
                        container.appendChild(div);
                        shownQuotes.push(quote); 
                    }
                });

            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
        loadNew.style.display = 'none'; 
        BackButton.style.display = 'inline-block'; // Ocultar el botón extra
    });
   
    BackButton.addEventListener('click', function() {
        container.innerHTML = ''; // Limpiar citas anteriores
        isFirstLoad = true;
        fetchQuotes(6);

        
    });
});
