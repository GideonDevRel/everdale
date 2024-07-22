document.addEventListener('DOMContentLoaded', () => {
  const filmsList = document.getElementById('films');
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const showtime = document.getElementById('showtime');
  const availableTickets = document.getElementById('available-tickets');
  const description = document.getElementById('description');
  const buyTicketButton = document.getElementById('buy-ticket');

  let currentMovie = null;

  // Fetch all films
  fetch('http://localhost:3000/films')
      .then(response => response.json())
      .then(movies => {
          if (movies.length > 0) {
              currentMovie = movies[0];
              updateMovieDetails(currentMovie);
          }

          // Populate movie list
          movies.forEach(movie => {
              const li = document.createElement('li');
              li.classList.add('movie-card');

              const img = document.createElement('img');
              img.src = movie.poster;
              li.appendChild(img);

              const detailsDiv = document.createElement('div');

              const title = document.createElement('h3');
              title.textContent = movie.title;
              detailsDiv.appendChild(title);

              const runtime = document.createElement('p');
              runtime.textContent = `Runtime: ${movie.runtime} minutes`;
              detailsDiv.appendChild(runtime);

              const showtime = document.createElement('p');
              showtime.textContent = `Showtime: ${movie.showtime}`;
              detailsDiv.appendChild(showtime);

              li.appendChild(detailsDiv);

              li.addEventListener('click', () => {
                  fetch(`http://localhost:3000/films/${movie.id}`)
                      .then(response => response.json())
                      .then(film => {
                          currentMovie = film;
                          updateMovieDetails(film);
                      })
                      .catch(error => {
                          console.error('Fetch error:', error);
                      });
              });

              filmsList.appendChild(li);
          });
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });

  // Update movie details in the DOM
  function updateMovieDetails(movie) {
      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = movie.runtime;
      showtime.textContent = movie.showtime;
      availableTickets.textContent = movie.capacity - movie.tickets_sold;
      description.textContent = movie.description;
  }

  // Handle ticket buying
  buyTicketButton.addEventListener('click', () => {
      if (currentMovie && currentMovie.capacity - currentMovie.tickets_sold > 0) {
          currentMovie.tickets_sold++;
          availableTickets.textContent = currentMovie.capacity - currentMovie.tickets_sold;
      } else {
          alert('Sold out!');
      }
  });
});
