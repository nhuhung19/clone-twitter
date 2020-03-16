let textArea = document.getElementById('textArea')
let userImg = document.getElementById('user-img')
const signOutButton = document.getElementById('signOut')
    // let userInput = document.getElementById('userInput')
let twitterArray = []



async function getData() {
    const res = await fetch("https://api.myjson.com/bins/1gvs62");
    const data = await res.json();
    console.log(data)
        // let dataArray = JSON.parse(localStorage.getItem('dataTweet'))
        // if (dataArray == null) {
        //    dataArray = []
        // }
    return data || []
}




let hashTagArray = []
let id = 0;


const countText = () => {
    let countResult = 140 - textArea.value.length

    if (countResult < 0) {
        document.getElementById('countText').innerHTML = `${countResult} characters left`.fontcolor("red")
    } else
        document.getElementById('countText').innerHTML = `${countResult} characters left`
}

textArea.addEventListener('input', countText)
let currentName = JSON.parse(localStorage.getItem('data'))
console.log(currentName)

const addTwitter = () => {
    let styleMention = `style="font-weight:bold; color: red; cursor: pointer;"`
    let originalContent = textArea.value
    let arrayContent = originalContent.split(' ')
    hashTagArray = arrayContent.filter((text) => text[0] == '#')
        // cai mớ gì đay chen hash tag vs img của e đó :)))
    for (let i = 0; i < arrayContent.length; i++) {
        if (arrayContent[i][0] == '#' || arrayContent[i][0] == '@') {
            arrayContent[i] = `<span onclick="hashTagFilter('${arrayContent[i]}')" ${arrayContent[i][0] == '@' ? styleMention : ''} style="color:blue; cursor: pointer;">${arrayContent[i]}</span>`
        }
        if (arrayContent[i].includes('http')) {
            arrayContent[i] = `<img class="w-100 h-50" src="${arrayContent[i]}" alt="img">`
        }
    }
    let contentConvert = arrayContent.join(' ')
        // console.log('user image:', userImg.value)
    let twitterStory = {
        id: id,
        userName: currentName.userName,
        timeTwitt: moment().startOf('hour').fromNow(),
        content: contentConvert,
        like: false,
        comment: '',
        hashtagText: hashTagArray

    }
    twitterArray.unshift(twitterStory)
    console.log('this is hastag', twitterStory.hashtagText)
    render(twitterArray)
    id++
    document.getElementById('textArea').value = ''
    document.getElementById('countText').innerHTML = `140 characters left`

}
const toggleLike = (id) => {
    let twitterLikeObj = twitterArray.find((item) => item.id == id)
    twitterLikeObj.like = !twitterLikeObj.like
    render(twitterArray)
}

const addComment = (i) => {
    twitterArray[i].comment = prompt('Enter Your Message')
    render(twitterArray)

}

const deleteTwitt = (originId) => {

    // let deletedObject = twitterArray.find((item) => item.id == originId);
    let retweetList = twitterArray.filter((item) => item.original);

    if (retweetList != null) {
        retweetList = retweetList.filter((item) => item.original.id == originId)
        let retweetIdList = retweetList.map((item) => item.id)

        twitterArray = twitterArray.filter((item) => !retweetIdList.includes(item.id))
    }

    twitterArray = twitterArray.filter((item) => item.id !== originId);

    render(twitterArray)
}

const reTwitt = (originId) => {
        let originTwitt = twitterArray.find((item) => item.id == originId)
        let newTwittContent = prompt('Why you retwitt ?')
        let styleMention = `style="font-weight:bold; color: red; cursor: pointer;"`
            // let originalContent = textArea.value
        let arrayContent = newTwittContent.split(' ')
        hashTagArray = arrayContent.filter((text) => text[0] == '#')

        for (let i = 0; i < arrayContent.length; i++) {
            if (arrayContent[i][0] == '#' || arrayContent[i][0] == '@') {
                arrayContent[i] = `<span onclick="hashTagFilter('${arrayContent[i]}')" ${arrayContent[i][0] == '@' ? styleMention : ''} style="color:blue; cursor: pointer;">${arrayContent[i]}</span>`
            }
            if (arrayContent[i].includes('http')) {
                arrayContent[i] = `<img class="w-100 h-50" src="${arrayContent[i]}" alt="img">`
            }
        }
        let contentConvert = arrayContent.join(' ')
        let reTwittObject = {
            id: id,
            userName: currentName.userName,
            timeTwitt: moment().startOf('hour').fromNow(),
            content: contentConvert,
            like: false,
            hashtagText: hashTagArray,
            comment: '',
            original: {
                timeTwitt: originTwitt.timeTwitt,
                id: originId,
                userName: originTwitt.userName,
                content: originTwitt.content,
                // more
            } // original tweet info
        }
        twitterArray.unshift(reTwittObject)
        render(twitterArray)
        id++
    }
    // vừa ngủ dậy

const hashTagFilter = (text) => {
    console.log('text', text)
    let a = twitterArray.filter((item) => {
        return item.hashtagText.includes(text);
    })
    render(a)
};

const updateData = async(obj) => {
    const resp = await fetch("https://api.myjson.com/bins/1gvs62", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    const data = await resp.json(); // không cần dòng này vì không quan tâm lắm kết quả
}

const render = async(array) => {

    console.log(array)
    await updateData(array) // update api

    let resultArray = array.map((item, i) => {
        let retwitt // by default will be null
        let comment = `<div class="ml-4 pt-3 pb-3">
                            <img class="mr-2 rounded-pill" src="img/cat.png" width="50" height="50">
                            <span style="color:rgb(47,208,231); font-weight:bold">${item.userName}</span> 
                            <span>${item.comment}</span>
                        </div>`
        let imgTwitt = `<div><img src="${item.image}" alt=""></div>`
        if (item.original) { // check if there is a original object in side item (tweet)
            retwitt = `
            <div class="card">
                <div class="card-header">
                    <img class="mr-2 rounded-pill" src="img/cat.png" width="50" height="50">
                    <span style="color:rgb(47,208,231); font-weight:bold">${item.original.userName}</span>
                    <span class="text-muted">${item.original.timeTwitt}</span>
                    <div class="card-body">
                        <p class="card-text">${item.original.content}</p>   
                    </div>
                </div>
            </div>`
        }
        let tweet = `
        <div class="card mt-5 w-100"  style="border-color:rgb(47,208,231)">
            <div class="card-header">
                <img class="mr-2 rounded-pill" src="img/cat.png" width="50" height="50">
                <span class="h5" style="color:rgb(47,208,231); font-weight:bold">${item.userName}</span>
                <span class="h6 text-muted">${item.timeTwitt}</span>
            </div>
            <div class="card-body">
                <p class="card-text">${item.content}</p>
                ${retwitt ? retwitt : ""}
                ${imgTwitt ? imgTwitt : ''}
            </div>
            <div class="card-footer">
                <a onclick="toggleLike(${item.id})" class="btn">${item.like ? '<i class="fas fa-heart hoverbtn" style="color:red"></i><span> Like</span>' : '<i class="far fa-heart hoverbtn" style="color:rgb(47,208,231)"></i><span> Unlike</span>'}</a>
                <a onclick="addComment(${i})" class="btn"><i class="far fa-comment hoverbtn" style="color:rgb(47,208,231)"></i><span> Comment</span></a>
                <a onclick="reTwitt(${item.id})" class="btn"><i class="fas fa-retweet hoverbtn" style="color:rgb(47,208,231)"></i><span> Retweet</span></a>
                <a onclick="deleteTwitt(${item.id})" class="btn"><i class="far fa-trash-alt hoverbtn" style="color:red"></i><span> Delete</span></a>   
            </div>
            ${item.comment ? comment : ''}
        </div>`

        return tweet
    }).join('')

    document.getElementById('twitter-stories').innerHTML = resultArray
    document.getElementById('total-twitter').innerHTML = twitterArray.length
    document.getElementById('countText').innerHTML = `140 characters left`
    document.getElementById('userNameDisplay').innerHTML = currentName.userName
    saveData()

}

const saveData = () => {
    localStorage.setItem('dataTweet', JSON.stringify(twitterArray))
}

const signOut = () => {
    window.location.replace("/index.html")

}
signOutButton.addEventListener("click", signOut)



async function runApp() {
    twitterArray = await getData()
    render(twitterArray)
}
runApp()