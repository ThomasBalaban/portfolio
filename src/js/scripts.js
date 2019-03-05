var moreInfo = document.getElementsByClassName('open-button');
var closeBtn = document.getElementsByClassName('close-button');


for (var i = 0; i < moreInfo.length; i++) {
    moreInfo[i].addEventListener('click', function(){
        var info = this.parentNode.parentNode.getElementsByClassName('information-drop')[0];
        //console.log(this.parentNode);

        if(info.style.display == "block"){
            info.style.display = "none";
            this.parentNode.getElementsByClassName('close-button')[0].style.display = "none"; 
        } else {
            info.style.display = "block";
            this.style.display = "none"; 
            this.parentNode.getElementsByClassName('close-button')[0].style.display = "block"; 
        }
    });

    closeBtn[i].addEventListener('click', function(){
        //console.log(this.parentNode.parentNode.getElementsByClassName('image')[0].getElementsByClassName('information-drop')[0].style.display == "block");
        if(this.parentNode.parentNode.getElementsByClassName('image')[0].getElementsByClassName('information-drop')[0].style.display == "block"){
            this.parentNode.style.display = "flex";
            this.parentNode.getElementsByClassName('open-button')[0].style.display = "block";
            this.parentNode.parentNode.getElementsByClassName('image')[0].getElementsByClassName('information-drop')[0].style.display = "none";
            this.style.display = "none"; 
            
        }
    });

    // I know there is a easier way to do this but short amount of time + fire ball = bad code // TO-DO: CLEAN THIS
}


// make sticky nav
var nav = document.getElementById('navigation');
var navOS = nav.offsetTop;
var homeTop = document.getElementsByClassName('intro')[0];
var homeTopOs = homeTop.offsetTop;

if(navOS <= 0) {
    nav.classList.add('fixed-nav');
} else {
    nav.classList.remove('fixed-nav');
}

window.addEventListener('scroll', function(ev) {
    if(window.pageYOffset >= navOS) {
        nav.classList.add('fixed-nav');
    } else {
        nav.classList.remove('fixed-nav');
    }
});

var topDown = document.getElementById('topDown');
if( topDown != null){
    topDown.addEventListener('click', function(){

        var y = homeTop.getBoundingClientRect().top + window.scrollY - 75;
        window.scroll({
            top: y,
            behavior: 'smooth'
        });
    });
}

var url = window.location.href.toString().split(window.location.host)[1];

if (url == "/"){
    document.querySelector('.home-btn img').style.display = "inline-block";
}

if (url == "/portfolio/"){
    document.querySelector('.port-btn img').style.display = "inline-block";
}

if (url == "/info/"){
    document.querySelector('.info-btn img').style.display = "inline-block";
}