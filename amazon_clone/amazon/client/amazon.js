const imgs = document.querySelectorAll('.background-images ul img');
const prev_btn = document.querySelector('.prev');
const next_btn = document.querySelector('.next');
let n = 0;
function changeBackgroundimage(){
    for(let i = 0; i < imgs.length; i++){
        imgs[i].style.display = 'none';
    }
    imgs[n].style.display = 'block';
}
changeBackgroundimage();
prev_btn.addEventListener('click', (e)=>{
    if(n>0){
        n--;
    }
    else{
        n = imgs.length - 1;
    }
    changeBackgroundimage();
})
next_btn.addEventListener('click', (e)=>{
    if(n < imgs.length - 1){
        n++;
    }
    else{
        n = 0;
    }
    changeBackgroundimage();
})
document.addEventListener('DOMContentLoaded', function() {
    // localStorage.clear()
    const accountsLink = document.getElementById('accounts-link');
    const dialogueBox = document.getElementById('dialogue-box');

    // Show the dialogue box when hovering over the "Accounts" link
    accountsLink.addEventListener('mouseover', function() {
      dialogueBox.style.display = 'block';
    });

    // Hide the dialogue box when the mouse leaves the "Accounts" link or the dialogue box itself
    accountsLink.addEventListener('mouseleave', function() {
      dialogueBox.style.display = 'none';
    });

    dialogueBox.addEventListener('mouseleave', function() {
      dialogueBox.style.display = 'none';
    });
  });
function searchData()
{
    localStorage.clear();
    search=document.querySelector('.search-input');
    console.log(search.value)
    const search_data=search.value;
    localStorage.setItem('search-item',search_data);
    console.log(localStorage)
    window.location.href='./content.html';
}





