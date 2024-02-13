// Variables
const loadingPicture = "./img/loading_2.jpg"
const examplePicture = "./img/movie_poster_1.jpg"

const imageHandle = document.querySelector("#imageContainer img")
const guessInputBox = document.querySelector("#guessInputField")

const dummyYear = 2000

//
// Initial load, dummy image
imageHandle.src = loadingPicture

// Wait page to load, focus on input box
document.addEventListener("DOMContentLoaded", () => {
    guessInputBox.focus()
})

guessInputBox.addEventListener("keydown", (press) => {
    if (press.keyCode === 13) {
        handleAnswer()
    }
})

const handleAnswer = () => {

    console.log(guessCorrect())
    //
    // TODO: Handle correct/incorrect
    //
    // TODO: add stats
    //
    // TODO: run correct/incorrect status update
    //
    // TODO: set loadimage dummy
    // imageHandle.src = loadingPicture

    guessInputBox.value = ""
}

const guessCorrect = () => {
    // This had a 10 line try-catch block, but it seems this does the same job
    // I could not get it to throw an error with any input..
    return Number(guessInputBox.value) === dummyYear
}



