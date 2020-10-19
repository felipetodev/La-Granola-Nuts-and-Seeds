const d = document;

let i = 0;
const carouselSlider = () => {
    $carouselSlide = d.querySelectorAll(".carousel__slide");
    setInterval((e) => {

        $carouselSlide[i].classList.remove("active");
        i++;

        if (i >= $carouselSlide.length) {
            i = 0;
        }

        $carouselSlide[i].classList.add("active");

    }, 5000);
}

carouselSlider();

function hamburgerBtn(panelBtn, panel, menuLink) {

    d.addEventListener("click", e => {
        if (e.target.matches(panelBtn) || e.target.matches(`${panelBtn} *`)) {
            d.querySelector(panelBtn).classList.toggle("is-active");
            d.querySelector(panel).classList.toggle("is-active");
        }

        if (e.target.matches(menuLink)) {
            document.querySelector(panel).classList.remove("is-active");
            document.querySelector(panelBtn).classList.remove("is-active");
        }
    });
}

d.addEventListener("DOMContentLoaded", e => {
    hamburgerBtn(".panel-btn", ".nav", ".nav a");
});




/***************
----SECTION----
***************/




const $instagramFeed = d.getElementById("instagram-feed");

let username = "lagranolacl";
let INSTA = "https://instagram.com/";
// let user = null;
// let posts = null;

async function instagramFeed() {
    let res = await fetch(INSTA + username + "?__a=1", {
        method: "GET"
    });

    let json = await res.json();

    user = json.graphql.user;
    posts = user.edge_owner_to_timeline_media.edges;

    console.log(posts[0].node);

    for (let i = 0; i < 5; i++) {

        $instagramFeed.innerHTML += `
                    <figure class="last__timeline">
                            <img src="${posts[i].node.thumbnail_src}"/>
                        <a class="post__${posts[i].node.owner.username}" href="https://www.instagram.com/p/${posts[i].node.shortcode}/" target="_blank">
                            <figcaption class="post__info">
                                <i class="like__icon far fa-heart"> ${posts[i].node.edge_liked_by.count}</i> 
                                <i class="comment__icon far fa-comment"> ${posts[i].node.edge_media_to_comment.count}</i>
                            </figcaption>
                        </a>
                    </figure>
                `;
    }

}

instagramFeed();