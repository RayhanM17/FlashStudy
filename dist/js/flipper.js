

const getItemsFromStorage = function() {
  let items;
  if (localStorage.getItem('items') === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem('items'));
  }
  return items;
}

let currentItem = null;

const togglePrevious = (items, scene) => {
  if (currentItem - 1 >= 0) {
    scene.children[0].children[0].textContent = items[currentItem - 1].front
    scene.children[0].children[1].textContent = items[currentItem - 1].back

    currentItem = currentItem - 1;
  } else {
    scene.children[0].children[0].textContent = items[items.length - 1].front
    scene.children[0].children[1].textContent = items[items.length - 1].back

    currentItem = items.length - 1;
  }
}

const toggleNext = (items, scene) => {
  if (currentItem + 1 <= items.length - 1) {
    scene.children[0].children[0].textContent = items[currentItem + 1].front
    scene.children[0].children[1].textContent = items[currentItem + 1].back
    currentItem = currentItem + 1;
  } else {
    scene.children[0].children[0].textContent = items[0].front
    scene.children[0].children[1].textContent = items[0].back
    currentItem = 0;
  }
}

const setEvents = (items, scene) => {
  const previousBtn = document.querySelector('#previous-btn')
  const nextBtn = document.querySelector('#next-btn')

  if (items.length < 2) {
    previousBtn.classList.add('d-none');
    nextBtn.classList.add('d-none');
  } else {
    previousBtn.addEventListener('click', () => {
      toggleNext(items, scene)
    })
    nextBtn.addEventListener('click', () => {
      toggleNext(items, scene)
    })
  }
}

const displayResults = function(items) {
  const flipper = document.querySelector('.flipper');
  const scene = document.querySelector('.scene');

  if (items.length > 0) {
    scene.children[0].children[0].textContent = items[0].front
    scene.children[0].children[1].textContent = items[0].back
    currentItem = 0;
    setEvents(items, scene)
  } else {
    flipper.innerHTML = `
      <div class="container mt-5 text-light d-flex flex-column align-items-center justify-content-center">
        <p> No Cards Found</p>
        <a href="form.html"class="btn btn-primary"> Click here to create cards</a>
      </div>
    `
  }
}

displayResults(getItemsFromStorage())

var card = document.querySelector('.card');
card.addEventListener('click', function() {
  card.classList.toggle('is-flipped');
});