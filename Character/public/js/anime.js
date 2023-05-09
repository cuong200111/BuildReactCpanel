const search = document.querySelector('search')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
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
document.querySelector('.menu_hidden').addEventListener('click', () => {
        document.querySelector('.menu_hidden>ul').classList.toggle('active')
    })
    // ul header
    if (window.innerWidth > 768) {
        console.log('ss');
        document.querySelector('.menu_hidden').addEventListener('mouseover', () => {
            document.querySelector('.menu_hidden>ul').classList.add('active')
        })
        document.querySelector('.menu_hidden').addEventListener('mouseout', () => {
            document.querySelector('.menu_hidden>ul').classList.remove('active')
        })
    }