const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "5pu429kpceu3",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "DxgrXFRtdIkxsSR3JlQ40ADLJAcJFDXFQNbwyYSRhC8"
  });


//All the variables name
const cartBtn=document.querySelector('.cart-btn');
const cartDOM=document.querySelector(".cart");
const cartOverlayDOM=document.querySelector(".cart-overlay");
const productsDOM=document.querySelector('.products-center');
const closeCartBtn=document.querySelector('.close-cart');
const cartClear=document.querySelector('.clear-cart');
const cartItems=document.querySelector(".cart-items");
const cartTotal =document.querySelector(".cart-total")
const cartContent=document.querySelector(".cart-content")


//Placing all the obj taking and getting info form this cart only;
let mainCart=[];
let allButtonDOMS=[]


class getProducts{
    async Products(){
        try{
            let contentful= await client.getEntries({
                content_type: 'streetFooder'
            });
            //local data which is stored in JSON
            /*
            let promise=await fetch('product.json');
            let data=await promise.json();
            */
            let prod=contentful.items;
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
    
    
    BagButtons(){
        const buttons=[...document.querySelectorAll('.bag-btn')]; // this will create an array instead of nodelist 
        
        allButtonDOMS=buttons;// adding all the buttons to the array

        buttons.forEach(button=>{

            let id=button.dataset.id;
            const inCart=mainCart.find(item=>item.id===id);
            
            if(inCart){
                button.innerText="In Cart";
                button.disabled=true;
            }
            
            button.addEventListener("click",(event)=>{
                event.target.innerText="In cart";
                event.target.disabled=true;

                //get product form product
                let cartItem=storage.getTheProduct(id);
                
                //add product to the cart
                mainCart=[...mainCart,cartItem];
                
                //save cart items to local storage
                storage.saveCart(mainCart);
                
                //set cart value
                this.setCartValues(mainCart);
                //display cart item
                this.addCartItem(mainCart);


                // show the cart
                 this.showCart();


        });
        });
    }
    setCartValues(mainCart){
        let totalCartCost=0,itemsTotal=0; 
        mainCart.map(item=>{
            totalCartCost+=item.price*item.amount;
            itemsTotal+=item.amount;
        })
        cartTotal.innerText=parseFloat(totalCartCost.toFixed(2));
        cartItems.innerText=itemsTotal;
    }
    addCartItem(item){
        const div=document.createElement("div");
        div.classList.add('cart-item');
        div.innerHTML=`<img src=${item.img} alt="product">     
        <div>
            <h4>${item.title}</h4>
            <h5><i class="fas fa-rupee-sign"></i>${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>

            <i class="fas fa-plus" data-id=${item.id}></i>
            <div class="item-amount">${item.amount}</div>
            <i class="fas fa-minus" data-id=${item.id}></i>
         
        </div>`;    
        cartContent.appendChild(div);

    }
    
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');

    }
    
    //to store the last selected element in the caert
    setUp(){
        mainCart=storage.savedItemsInCart();
        this.setCartValues(mainCart);
        this.populateCart(mainCart);
        cartBtn.addEventListener("click",this.showCart);
        closeCartBtn.addEventListener("click",this.closeCart);
    }

    populateCart(cart){
        cart.forEach(item=>this.addCartItem(item));
    }

    closeCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic(){
        cartClear.addEventListener("click",()=>{
            this.clearCart();
        });

        
    ////EVENT bubbling
    cartContent.addEventListener("click",event=>{
        if(event.target.classList.contains('remove-item')){
            let remove_Item=event.target;
            let id=remove_Item.dataset.id;
            //as we want to remove the object but remove is in child div of cart-item so we need to go to remove-item parents parent(ie data-item) 
            cartContent.removeChild( remove_Item.parentElement.parentElement);
            this.removeItem(id);
        }

        else if(event.target.classList.contains('fa-plus')){
            let addAmount=event.target;
            let id=addAmount.dataset.id;
            let tempItem=mainCart.find(item=>item.id===id);
            tempItem.amount=tempItem.amount+1;
            //saving in local storage
            storage.saveCart(mainCart);
            this.setCartValues(mainCart);
            addAmount.nextElementSibling.innerText=tempItem.amount;
        }
        else if(event.target.classList.contains("fa-minus")){
            let subAmount=event.target;
            let id=subAmount.dataset.id;
            let tempItem=mainCart.find(item=>item.id===id);
            tempItem.amount=tempItem.amount-1;
            if(tempItem.amount>0){    
                storage.saveCart(mainCart);
                this.setCartValues(mainCart);
                subAmount.previousElementSibling.innerText=tempItem.amount;
            }
            else{
                cartContent.removeChild(subAmount.parentElement.parentElement);
                this.removeItem(id);
            }
        }
    })

    }
    clearCart(){
        let cart_Item=mainCart.map(item=>item.id);
        cart_Item.forEach(id=>this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.closeCart();
    }

    removeItem(id){
        mainCart=mainCart.filter(item=>item.id!==id);
        this.setCartValues(mainCart);
        storage.saveCart(mainCart);
        let button=this.getSingleButton(id);
        button.disabled=false;
        button.innerHTML=`<i class="fas fa-shopping-cart"></i>Add to cart`;

    }

    getSingleButton(id){
        return allButtonDOMS.find(button=>button.dataset.id===id);
    }

}

class storage{
        //We don't need to call this methord again becuase it is a static methord
    static saveProduct(products){
        localStorage.setItem("product",JSON.stringify(products));
    }
    static getTheProduct(id){
        let products=JSON.parse(localStorage.getItem("product"));
        return products.find(product=>product.id===id);
    }
      static saveCart(cart){
            localStorage.setItem("cart",JSON.stringify(cart));
        }

        //to return stored element's inside the cart
        static savedItemsInCart(){
            return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
        }

}

/*
The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. 
*/


document.addEventListener("DOMContentLoaded",()=>{
    let ui=new display();
    let porducts=new getProducts(); 
    //getting the products 
    products.getProducts().then(products=>{ui.displayProducts(products);
    storage.saveProduct(products)}).then(()=>{
        ui.BagButtons();
        ui.cartLogic();
    });
});
