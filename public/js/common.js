

const dropBtn_1 = document.getElementsByClassName("drop-btn-1");
const dropSection_1 = document.querySelector(".drop-out-1");
// console.log(dropBtn_1);

for (let i = 0; i < dropBtn_1.length; i++) {
    dropBtn_1[i].addEventListener('click', (event) => {
        // console.log(event.target);
        if (!dropSection_2.classList.contains("dropout-unactive")) {
            dropSection_2.classList.add("dropout-unactive");
        }
        dropSection_1.classList.toggle("dropout-unactive");
        let bottomHeight = findBottomHeight();
        console.log("bottomHeight", bottomHeight);

        for (let i = 0; i < dropDown.length; i++) {
            dropDown[i].style.top = `${5 * 16 + bottomHeight}px`;
            // console.log("top value", dropDown[i].style.top);
        }

    });
}


const dropBtn_2 = document.getElementsByClassName("drop-btn-2");
const dropSection_2 = document.querySelector(".drop-out-2");
// console.log(dropBtn_2);

for (let i = 0; i < dropBtn_2.length; i++) {
    dropBtn_2[i].addEventListener('click', (event) => {
        // console.log(event.target);
        if (!dropSection_1.classList.contains("dropout-unactive")) {
            dropSection_1.classList.add("dropout-unactive");
        }
        dropSection_2.classList.toggle("dropout-unactive");
        let bottomHeight = findBottomHeight();
        // console.log("bottomHeight", bottomHeight);

        for(let i=0;i<dropDown.length;i++){
            dropDown[i].style.top = `${5*16 + bottomHeight}px`;
        // console.log("top value",dropDown[i].style.top);
        }
    });
}



// window.addEventListener('click',(e)=>{
//     console.log(e.target);
// })



//for respo header
