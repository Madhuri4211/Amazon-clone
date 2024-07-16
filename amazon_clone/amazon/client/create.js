document.getElementById("signup-form").addEventListener('submit', async function(event) {
    event.preventDefault();
    const username=document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(JSON.stringify({username, email, password }))
    const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username,email, password })
    });
    const data = await response.json();
    message=data.message
    console.log(message)
    messageBox=document.getElementById('message')
    if(message=='User already exists'){
        messageBox.innerText = message;
        messageBox.style.display='block'

    }
    else{
        window.location.href='./login.html'
        // localStorage.clear()
        // localStorage.setItem('message',message);
    }
});


