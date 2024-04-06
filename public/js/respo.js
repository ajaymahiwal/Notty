let hamBurgerMenu = document.getElementsByClassName("hamburger-menu");
let bottomHeader = document.querySelector(".bottom-header");

// console.dir(hamBurgerMenu)

// const dropSec_1 = document.querySelector(".drop-out-1");
// const dropSec_2 = document.querySelector(".drop-out-2");

for(let i=0;i<hamBurgerMenu.length;i++){
    hamBurgerMenu[i].addEventListener('click',(e)=>{
        // console.log("clicked")
        bottomHeader.classList.toggle("hide");
        // if(!dropSec_1.classList.contains("dropout-unactive")){
        //     dropSec_1.classList.add("dropout-unactive");
        // }
        // if(!dropSec_2.classList.contains("dropout-unactive")){
        //     dropSec_2.classList.add("dropout-unactive");
        // }
    })
}



const dropDown = document.getElementsByClassName("drop-down");
const allBottomHeader = document.getElementsByClassName("bottom-header");



// const root = document.documentElement;
// // console.log(root);
// const computedStyle = getComputedStyle(root);
// // console.log(computedStyle);
// const headerHeight = computedStyle.getPropertyValue("--header-height");
// // console.log("headerHeight",headerHeight);

// function findBottomHeight(){
//     let bottomHeight = allBottomHeader[0].offsetHeight;
//     // console.log("bottomHeight",bottomHeight);
//     return bottomHeight;
// }

// let bottomHeight = findBottomHeight();
// // console.log("bottomHeight",bottomHeight);

// for(let i=0;i<dropDown.length;i++){
//     dropDown[i].style.top = `${5*16 + bottomHeight}px`;
// // console.log("top value",dropDown[i].style.top);
// }


