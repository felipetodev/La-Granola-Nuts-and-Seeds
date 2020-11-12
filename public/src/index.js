// import STRIPE_KEYS from "./stripe-key.js";
const d = document;

//MainCarousel
const $carouselSlide = d.querySelectorAll(".carousel__slide");

if($carouselSlide) {
    let i = 0;
    const carouselSlider = () => {
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
}

//HamburgerMenu

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
    contactFormValidation();
});


//Instagram Feed

const $instagramFeed = d.getElementById("instagram-feed");

if($instagramFeed) {
    let username = "lagranolacl";
    let INSTA = "https://instagram.com/";

    async function instagramFeed() {
        let res = await fetch(INSTA + username + "?__a=1", {
            method: "GET"
        });

        let json = await res.json();

        user = json.graphql.user;
        posts = user.edge_owner_to_timeline_media.edges;

        // console.log(posts[0].node);

        for (let i = 0; i < 5; i++) {

            $instagramFeed.innerHTML += `
                <figure class="last__timeline">
                    <img src="${posts[i].node.thumbnail_src}" alt="lagranolacl"/>
                    <a class="post__${posts[i].node.owner.username}" href="https://www.instagram.com/p/${posts[i].node.shortcode}/" target="_blank" rel="noopener">
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
}

/* Formulario */

function contactFormValidation() {
    const $form = d.querySelector(".contact-form");

    d.addEventListener("submit", e => {
        e.preventDefault(); //<------------------------------------------------

        const $loader = d.querySelector(".contact-form-loader");
        const $response = d.querySelector(".contact-form-response");
    
        $loader.classList.remove("none");
    
        setTimeout(() => {
            $loader.classList.add("none");
            $response.classList.remove("none");
            $form.reset();
    
            setTimeout(() => {
                $response.classList.add("none");
            }, 3000)
    
        }, 3000)
    })
}

contactFormValidation();

/* Cambios en el Header */

let path = location.pathname;
let host = location.host;
let page = path.substring(0, path.lastIndexOf("."));
let newPage = page.split("/").pop();

if(path !== "/index.html" && path !== "/" ) {
    function headerChanges() {

        const $carouselSlides = d.querySelector(".carousel__slides");
        const $header = d.querySelector("header");
        const $hero = d.querySelector(".hero");
        const $dinamicRoute = d.createElement("div");
            $dinamicRoute.classList.add("dinamic-route");

        const getHeight = (elem) => {
            let styles = getComputedStyle(elem);
            let heightValue = styles.height;
            let heigth = parseInt(heightValue);
            return heigth;
        }
        
        height = getHeight($carouselSlides);
        $carouselSlides.style.height = `350px`;
        $hero.style.display = 'none';

        $dinamicRoute.innerHTML = `
            <section class="actual__route">
                <p><a href="/index.html">Inicio</a> / ${newPage}</p>
            </section>
        `;

        $header.insertAdjacentElement("afterend", $dinamicRoute);

        $carouselSlides.innerHTML = `
            <div class="carousel__slide active">
                <img src="https://cdn.shopify.com/s/files/1/0399/2879/1201/files/All-B-Nat_Banner-Colecciones_1600x.jpg?v=1591378157" alt="${newPage}">
                <h2 class="carousel__title">${newPage}</h2>
            </div>
        `;
    }
    headerChanges();
}


/* Stripe */

const STRIPE_KEYS = {
    public: "",
    secret: ""
};

const $frutos = d.getElementById("frutos");

if ($frutos) {
    const $template = d.getElementById("frutos-template").content;
    const $fragment = d.createDocumentFragment(),
        fetchOptions = {
            headers: {
                Authorization: `Bearer ${STRIPE_KEYS.secret}`
            }
        };

    let products, prices;
    const moneyFormat = (num) => "$"+num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    Promise.all([
        fetch("https://api.stripe.com/v1/products", fetchOptions),
        fetch("https://api.stripe.com/v1/prices", fetchOptions)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(json => {
        //console.log(json);
        products = json[0].data;
        prices = json[1].data;
        console.log(products, prices);

        prices.forEach(el => {
            let productData = products.filter(product => product.id === el.product);
            // console.log(productData);

            $template.querySelector(".fruto").setAttribute("data-price", el.id);
            $template.querySelector("img").src = productData[0].images[0];
            $template.querySelector("img").alt = productData[0].name;
            $template.querySelector("figcaption").innerHTML = `
                <div class="product__hover" data-price="${el.id}"><p>+ Compra Rápida</p></div>
                <div class="product__info">
                    <p class="product__name">${productData[0].name} (${el.nickname})</p>
                    <p class="product__price">${moneyFormat(el.unit_amount)}</p>
                </div>
            `;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $frutos.appendChild($fragment);
    })
    .catch(err => {
        let message = err.statusText || "Ocurrió un error al conectarse con la API de Stripe";
        $frutos.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    });

    d.addEventListener("click", e => {
        if(e.target.matches(".fruto *") || e.target.matches(".product__hover *")) {
            let priceId = e.target.parentElement.getAttribute("data-price");
            // console.log(priceId);
            Stripe(STRIPE_KEYS.public)
                .redirectToCheckout({
                    lineItems: [{ price: priceId, quantity: 1 }],
                    mode: "payment",
                    successUrl: "http://localhost:8080/stripe-success.html",
                    cancelUrl: "http://localhost:8080/index.html",
            })
            .then(res => {
                console.log(res)
                if(res.error) {
                    $frutos.insertAdjacentHTML("afterend", res.error.message);
                }
            });
        }
    });

}