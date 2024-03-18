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
    let shownQuotes = []; // Array para almacenar las citas ya mostradas
    loadNew.style.display = 'none';
    
    async function fetchQuotes(count) {
        try {
            BackButton.style.display = 'none';
            loadMoreButton.style.display = 'none'; 
            if (isFirstLoad) {
                spinner.style.display = 'block';
                isFirstLoad = false; 
            }
            const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=${count}`);
            const data = await response.json();
            
            // Filtrar las citas ya mostradas
            const newQuotes = data.filter(quoteData => !shownQuotes.includes(quoteData.quote));
            
            // Agregar las nuevas citas al contenedor
            newQuotes.forEach(quoteData => {
                const { quote, character, image } = quoteData;
                const div = document.createElement('div');
                div.classList.add('character-box');
                div.innerHTML = `
                    <img src="${image}" alt="${character}">
                    <h2>${character}</h2>
                    <p>${quote}</p>
                `;
                container.appendChild(div);
                
                // Agregar la cita al array de citas mostradas
                shownQuotes.push(quote);
            });
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
        finally {
            spinner.style.display = 'none';
            loadMoreButton.style.display = 'inline-block'; 
        }
    }
    
    
    // Cargar 6 personajes al inicio
    await fetchQuotes(6);

    // Event listener para cargar más personajes al oprimir el botón
    loadMoreButton.addEventListener('click', async function() {
        await fetchQuotes(12); 
        });
    // Event listener para cargar citas por personaje al hacer clic en el botón de búsqueda
    searchButton.addEventListener('click', async () => {
        const character = characterInput.value.trim();
        loadMoreButton.style.display = 'none'; 

        if (character) {
            try {
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?character=${character}`);
                const data = await response.json();
        
                // Verificar si el personaje existe en el API
                if (data.length === 0) {
                    alert(`No se encontraron citas para el personaje ${character}.`);
                    loadMoreButton.style.display = 'inline-block'; 
                } else {
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
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                alert(`Hubo un error al obtener los datos. Por favor, intenta nuevamente más tarde.`);
            }

            characterInput.value = ''; // Limpiar el campo de texto después de buscar
        }
    });

   quoteButton.addEventListener('click', async () => {
    const character2 = characterInput2.value.trim();
    const quotes = parseInt(quoteInput.value.trim(), 10); // Convertir a número la cantidad de citas que el usuario desea obtener
    loadNew.style.display = 'none'; // Ocultar el botón loadNew al buscar nuevas citas
    loadMoreButton.style.display = 'none'; 

    if (character2 && quotes) {
        currentCharacter = character2;
        try {
            // Realizar la solicitud al API
            const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=${quotes}&character=${character2}`);
            const data = await response.json();
    
            // Verificar si el personaje existe en el API
            if (data.length === 0) {
                alert(`No se encontraron citas para el personaje ${character2}. Recuerda que el nombre de los personajes es en ingles`);
                loadNew.style.display = 'none';
                loadMoreButton.style.display = 'inline-block'; 

            } else {
                    
                // Limpiar citas anteriores y reiniciar el array de citas mostradas
                container.innerHTML = '';
                shownQuotes = [];
                loadNew.style.display = 'inline-block';
                
                if (data.length < quotes) { // Verificar si hay suficientes citas
                    alert(`Lo siento, solo hay ${data.length} citas de ${character2}.`);
                    loadNew.style.display = 'none'; 
                } 
                // Mostrar citas si el personaje existe
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
                });
                BackButton.style.display = 'inline-block';
            }
        } catch (error) {
            // Manejar errores de solicitud
            console.error('Error al obtener los datos:', error);
            alert(`Hubo un error al obtener los datos. Por favor, revisa que el numero sea positivo y mayor que cero.`);
            loadMoreButton.style.display = 'inline-block'; 

        }
    
        // Limpiar campos de texto después de buscar
        characterInput2.value = '';
        quoteInput.value = '';
    }

    });
        
    loadNew.addEventListener('click', async () => {
        if (currentCharacter) {
            
            try {
                const response = await fetch(`https://thesimpsonsquoteapi.glitch.me/quotes?count=15&character=${currentCharacter}`);
                const data = await response.json();
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
        loadNew.style.display = 'none'; 
        container.innerHTML = ''; // Limpiar citas anteriores
        shownQuotes = []
        isFirstLoad = true;
        fetchQuotes(6);

        
    });
});
    