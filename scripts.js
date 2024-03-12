
document.addEventListener("DOMContentLoaded", function() {
    // Llamada al API
    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
      .then(response => response.json())
      .then(data => {
        // Procesar los datos recibidos
        const container = document.getElementById('quote-container');
        data.forEach(quoteData => {
          const { quote, character, image } = quoteData;
          // Crear elementos HTML para cada personaje
          const div = document.createElement('div');
          div.classList.add('character-box');
          div.innerHTML = `
            <img src="${image}" alt="${character}">
            <h2>${character}</h2>
            <p>${quote}</p>
          `;
          // Agregar cada "caja" al contenedor principal
          container.appendChild(div);
        });
      })
      .catch(error => console.error('Error al obtener los datos:', error));
  });
  