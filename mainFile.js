//All the variables name
const cartBtn=document.querySelector('.cart-btn');
const cartDOM=document.querySelector(".cart");
const cartOverlayDOM=document.querySelector(".cart-overlay");
const productsDOM=document.querySelector('.products-center');
const closeCartBtn=document.querySelector('.close-cart');
const cartClear=document.querySelector('.clear-cart');
const cartItems=document.querySelector(".cart-item");
const cartTotal =document.querySelector(".cart-total")
const cartContent=document.querySelector(".cart-content")


//Placing all the obj taking and getting info form this cart only;
let mainCart=[];

class getProducts{
    async Products(){
        try{
            let promise=await fetch('product.json');
            let data=await promise.json();
            let prod=data.items;
            prod=prod.map(item=>{
                const {title,price}=item.fields;
                const {id}=item.sys;
                const img=item.fields.image.fields.file.url;
                return {title,price,id,img}
            })
            return prod;
        }
        catch(error){
            console.log(error);
        }
    }
}

class display{
    displayProducts(products){
        let result='';
        products.forEach(product=>{
            result+= `
                <article class="product">
                    <div class="img-container">
                        <img src=${product.img} alt="Image-one" class="product-img">
                        <button type="button" class="bag-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart">
                            Add to cart
                            </i>
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4><i class="fas fa-rupee-sign"></i>${product.price}</h4>
                </article>
            `;
        });
        productsDOM.innerHTML=result;
    }
}

class storage{
    constructor(item){

    }
}

/*
The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. 
*/


document.addEventListener("DOMContentLoaded",()=>{
    let ui=new display();
    let porducts=new getProducts(); 

    //getting the products 
    porducts.Products().then(products=>ui.displayProducts(products));
});
