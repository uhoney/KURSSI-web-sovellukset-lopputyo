const resetButton = document.querySelector("#resetButton")

// Could use localStorage.clear(), but this deletes variables, not reset
resetButton.addEventListener("click", () => {
    localStorage.setItem("guessTotal", "0")
    localStorage.setItem("guessCorrect", "0")
    localStorage.setItem("guessIncorrect", "0")
    refreshStats()
})

const refreshStats = () => {
    document.querySelector("#guessTotal").textContent = localStorage.getItem("guessTotal")
    document.querySelector("#guessCorrect").textContent = localStorage.getItem("guessCorrect")
    document.querySelector("#guessIncorrect").textContent = localStorage.getItem("guessIncorrect")
}

refreshStats()