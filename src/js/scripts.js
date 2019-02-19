var moreInfo = document.getElementsByClassName('more-info');

for (var i = 0; i < moreInfo.length; i++) {
    moreInfo[i].addEventListener('click', function(){
        this.style.display = "none";
        this.nextElementSibling.style.display = "block";
    })
}