let userInput = document.getElementById('inputUser')
document.getElementById('inputPassword').disabled = true;
const signInButton = document.getElementById('signIn')


const signIn = (e) => {
    e.preventDefault()
    let user = {
        userName: userInput.value
    }
    localStorage.setItem('data', JSON.stringify(user))
    window.location.replace("/main.html")
}

signInButton.addEventListener("click", signIn)