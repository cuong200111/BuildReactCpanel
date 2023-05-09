const search = document.querySelector('search')

const homepage_suggest = document.querySelector('.homepage_suggest')
const div_suggest = document.querySelectorAll('.div_suggest')
search.addEventListener('click', () => {
    document.querySelector('.top_bottom').classList.toggle('active');
})
const opencl = document.querySelector('.bottom_opcl')
const icon_opcl = document.getElementById('icon_opcl')
    // ul header
opencl.addEventListener('click', () => {
    if (document.querySelector('#label-check').checked) {
        document.querySelector('.bottom_list ul').classList.add('active')
    } else if (!document.querySelector('#label-check').checked) {
        document.querySelector('.bottom_list ul').classList.remove('active')
    }
})
if (window.innerWidth < 600) {
    document.querySelector('.menu_hidden').addEventListener('click', () => {
        document.querySelector('.menu_hidden>ul').classList.toggle('active')
    })
}
if (window.innerWidth > 768) {

    document.querySelector('.menu_hidden').addEventListener('mouseover', () => {
        document.querySelector('.menu_hidden>ul').classList.add('active')
    })
    document.querySelector('.menu_hidden').addEventListener('mouseout', () => {
        document.querySelector('.menu_hidden>ul').classList.remove('active')
    })
}


const slider = document.querySelector('.slider')
const slides = document.querySelector('.slides')
const slide = document.querySelectorAll('.slide')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
let index = 0
let clientwitdth = slide[0].clientWidth

const Runslider = (index) => {

    slides.style = `transform:translateX(-${(clientwitdth*index)+(5*index)}px)`
}
if(window.innerWidth <600){
    
if(slide.length >=3 ){

        document.querySelector('.control').classList.add('active')
        next.addEventListener('click',()=>{
            index++;
            if(index ==slide.length-1){
                index = 0
            }
            Runslider(index)
        })
        prev.addEventListener('click',()=>{
            index--;
            if(index<0){
                index=slide.length-2
            }
            Runslider(index)
        })
        setInterval(()=>{
            index++;
            if(index ==slide.length-1){
                index = 0
            }
            Runslider(index)
        },5000)
    }
 
    
}

console.log();
for(let i = 786 ; i<=2000 ;i++){

   if(window.innerWidth === i){
    console.log(i);
    const w = i-30
    slider.style = `width:${w}px`
   const slidelength = Math.floor(slider.clientWidth /150)
   const imglength = Math.floor(slide.length-slidelength)
   document.querySelector('.Bottom_Container_content').style = `grid-template-columns:repeat(${slidelength},1fr)`
   if(slidelength<slide.length){
    document.querySelector('.control').classList.add('active')
    next.addEventListener('click',()=>{
        console.log(index);
        index++;
        if(index >imglength){
            index = 0
        }
        Runslider(index)
    })
    prev.addEventListener('click',()=>{
        index--;
        if(index<0){
            index=imglength
        }
        Runslider(index)
    })
    setInterval(()=>{
        index++;
        if(index >imglength){
            index = 0
        }
        Runslider(index)
    },5000)
   }
   }
}