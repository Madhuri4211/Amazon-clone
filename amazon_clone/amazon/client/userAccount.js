document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(JSON.stringify({ email, password }))
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    message=data.message
    messageBox=document.getElementById('message')
    if(message=='User doesnot exists!!'){
        messageBox.innerText = message;
        messageBox.style.display='block'

    }
    else if(message=='Incorrect password!!'){
        messageBox.innerText = message;
        messageBox.style.display='block'
        document.getElementById('password').value=''
    }
    else{
        window.location.href='./amazon.html'
        // localStorage.clear()
        // localStorage.setItem('message',message);
    }
});


