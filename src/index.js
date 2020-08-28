let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection')
  const toyForm = document.querySelector('.add-toy-form')
  const likeButton = document.getElementsByClassName('like-btn')
  
  const renderToys = (collection) => {
    for(const toy of collection) {
      renderToy(toy)
    }
  }
  
  const renderToy = (toyObj) => {
    const toyDiv = document.createElement('div')
    toyDiv.className = 'card'
    toyDiv.dataset.id = toyObj.id
    toyDiv.innerHTML = `
      <h2>${toyObj.name}</h2>
      <img src="${toyObj.image}" class="toy-avatar">
      <p>${toyObj.likes} Likes</p>
      <button class="like-btn">Like <3</button>
    `
    toyCollection.append(toyDiv)
  }

  const sendData = (obj) => {
    fetch('http://localhost:3000/toys')
      .then(toy => toy.json())
      .then(toys => renderToys(toys))
  }

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener('submit', e => {
    e.preventDefault()
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyForm.name.value,
        image: toyForm.image.value,
        likes: 0
      })
    })
    .then(response => response.json())
    // .then(data => {
      
    // })
    .then(data => sendData(data))
    
    toyForm.reset()
    sendData()
    location.reload()
  })

  function clickHandler() {
    document.addEventListener('click', function(e){
      if(e.target.matches(".like-btn")) {
        const cardId = e.target.parentNode.dataset.id
        const currentLikes = parseInt(e.target.previousElementSibling.textContent.split(' ')[0])
        const likes = currentLikes + 1
        fetch(`http://localhost:3000/toys/${cardId}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
          likes: likes
          })
        })
        .then( response => response.json())
        .then(obj => {
          const card = document.querySelector(`[data-id="${obj.id}"]`)
          const x = card.querySelector('p')
          const newLike = parseInt(x.innerText.split(' ')[0]) + 1
          x.innerText = `${newLike} Likes`
          // debugger;
          // console.log(button)
        } )
        // location.reload()
      }
    })
  }

  clickHandler()
  sendData()
});
