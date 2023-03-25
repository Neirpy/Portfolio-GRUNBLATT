let projects = document.querySelectorAll('.project');
let modal = document.querySelectorAll('.modalProject');
let modalClose = document.querySelectorAll('.modalClose');
for (let i = 0; i < projects.length; i++) {
  console.log(projects[i], modal[i]);
  projects[i].addEventListener('click', function() {
    modal[i].classList.add('active');
    //bloque le scroll
    document.body.classList.add('noScroll');
    modalClose[i].addEventListener('click', function() {
      modal[i].classList.remove('active');
      //débloque le scroll
      document.body.classList.remove('noScroll');
    });
  });
}

