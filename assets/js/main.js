document.body.onload = function(){
    setTimeout(function(){
        let preloader = document.getElementById('page-preloader');
        if(!preloader.classList.contains('done')){
            preloader.classList.add('done');
        }
    },1000);
}
var eventBus = new Vue({});

Vue.component('product',{
    props:{
        cart_count:{
            type: Array,
            required: true,
        }
    },
    template:`
    <div class="container">
    <div class="product">
        <div class="product__image">
            <img :src="image" alt="">
        </div>
        <div class="product__content">
            <div class="product__text">
                <p class="product__subtitle">{{category}}</p>
                <h1 class="product__title">{{name}}</h1>
                <p class="product__description">{{info}}</p>
            </div>
            <div class="product__info">
                <div class="product__colors">
                    <p class="product__colors-title">Base colors</p>
                    <div class="product__colors-items">
                        <span class="product__colors-item"
                              v-for="(variant, index) in variants"
                              :key="variant.variantId"
                              :style="{backgroundColor: variant.variantColor}"
                              v-on:click="updateVariant(index)"></span>
                    </div>
                </div>
                <div class="product__sale">
                    <p class="product__sale-info"
                        v-if="variants[selectedVariant].variantSale">The product on this color is <span class="product__sale-info-span"> on Sale </span>now!
                    </p>
                    <p v-if="variants[selectedVariant].variantQuantity === 0">The product on this color is <span class="product__outofstock"> out of stock!</span>
                    </p>
                    <span class="product__price"
                          :class="{notActive: variants[selectedVariant].variantSale, OutOfStock: variants[selectedVariant].variantOutOfStock}">148$
                    </span>
                    <span class="product__price-sale"
                    v-if="variants[selectedVariant].variantSale" >{{variants[selectedVariant].variantSalePrice}}</span>
                </div>
                <div class="product__cta">
                    <button class="add-cart"
                        v-on:click="addToCart" 
                        :disabled = "variants[selectedVariant].variantOutOfStock">Add to Cart</button>
                    <span class="cart-count">Cart: </span>
                    <div class="class-change">
                            <span class="cart-minus" v-on:click="minusFromCart">-</span>
                            <span class="cart-count-num">{{cart_count.length}}</span>
                            <span class="cart-plus" v-on:click="addToCart">+</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    
    `,
    data(){
        return{
            category: 'chairs',
            name: 'Emaes Molded Fiberglass Side Chair',
            info: 'Available in both the arm and side chair formats in eight archival colors, the chairs can be configured with a choice of wire, dowel leg, stacking, rocker, and 4-leg bases',
            price: '148$',
            selectedVariant: 0,
            showCart: false,
            variants:[
                {
                    variantId: 114,
                    variantColor: '#DFDA89',
                    variantName:'yellow',
                    variantQuantity: 0,
                    variantSale: false,
                    variantSalePrice: '100$',
                    variantImage: 'assets/images/product-yellow.jpg',
                    variantOutOfStock: true,
                },
                {
                    variantId: 124,
                    variantColor: '#191919',
                    variantName:'black',
                    variantQuantity: 10,
                    variantSale: true,
                    variantSalePrice: '100$',
                    variantImage:'assets/images/product-black.jpg',
                    variantOutOfStock: false,

                },
                {
                    variantId: 134,
                    variantColor: '#C7E0E4',
                    variantName:'blue',
                    variantQuantity: 10,
                    variantSale: false,
                    variantSalePrice: '100$',
                    variantImage:'assets/images/product-blue.jpg',
                    variantOutOfStock: false,
                },
                {
                    variantId: 144,
                    variantColor: '#DEDEDE',
                    variantName:'grey',
                    variantQuantity: 10,
                    variantSale: true,
                    variantSalePrice: '90$',
                    variantImage:'assets/images/product-grey.jpg',
                    variantOutOfStock: false,
                },
            ]
        }
    },
    methods:{
        updateVariant: function(index){
            this.selectedVariant = index
        },
        addToCart: function(){
            this.$emit('add-to-cart-event', this.variants[this.selectedVariant].variantId)
        },
        minusFromCart: function(){
            this.$emit('remove-from-cart-event', this.variants[this.selectedVariant].variantId)
        }
    },
    computed:{
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        // VOutOfStock(){
        //     if(this.variant[this.selectedVariant].variantQuantity === 0){
        //          this.variant[this.selectedVariant].variantOutOfStock = true;
        //     }else{
        //         this.variant[this.selectedVariant].variantOutOfStock = false;
        //     }
        // }
    }
})

Vue.component('product-tabs',{
    template:`
    <div class="tabs-content">
    <ul class="tabs-list">
        <li class="tabs-item"
            v-for="tab in tabs"
            @click = "selectedTab = tab"
            :class = "{active: selectedTab === tab}">{{tab}}</li>
    </ul>
    <div class="tab-content desc-tab"
            v-show="selectedTab ==='Description'">
            <div class="container">
            <div class="descr-info">
                <p class="descr-info-text">
                    {{descriptions[0]}}
                </p>
                <blockquote class="descr-quote">
                    <p>
                    {{descriptions[1]}} 
                    </p>
                </blockquote>
                <p class="descr-info-text">
                {{descriptions[2]}}
                </p>
            </div>
        </div>    
    </div>
    <div class="tab-content reviews-tab"
            v-show="selectedTab ==='Reviews'">Reviews
            <ul>
            <li v-for="review in reviews">
                <p>{{review.name}}</p>
                <p>{{review.email}}</p>
                <p>{{review.review}}</p>
            </li>
        </ul>
    </div>
    <div class="tab-content"
            v-show="selectedTab ==='Shipping and Delivery'">
            <div class="container">
            <div class="shipping-tab">
                <div class="shipping-tab-imgs">
                    <img :src="shippingObj.imgf" class="shipping-tab-img">
                    <img :src="shippingObj.imgs" class="shipping-tab-img">
                </div>
                <div class="shipping-tab-info">
                    <h4 class="shipping-title title-first">{{shippingObj.firstcondname}}</h4>
                    <p class="shipping-text first-text">{{shippingObj.firstcondinfo}}</p>
                    <h4 class="shipping-title title-second">{{shippingObj.secondcondname}}</h4>
                    <p class="shipping-text second-text">{{shippingObj.secondcondinfo}}</p>
                </div>
            </div>
            
        </div>
            
            </div>
    <div class="tab-content"
            v-show="selectedTab ==='Leave Review'">
            <product-reviews @review-submitted="addReview"></product-reviews>
    </div>
</div>
    
    `,
    data(){
        return{
            reviews:[],
            tabs: ['Description','Reviews','Shipping and Delivery','Leave Review'],
            selectedTab: 'Leave Review',
            descriptions: [`Cubilia vestibulum interdum nisl a parturient a auctor vestibulum taciti 
            vel bibendum tempor adipiscing suspendisse posuere libero penatibus lorem at interdum tristique 
            iaculis redosan condimentum a ac rutrum mollis consectetur. Aenean nascetur vehicula egestas a 
            adipiscing a est egestas suspendisse parturient diam adipiscing mattis elementum velit pulvinar 
            suscipit sagittis facilisis facilisi tortor morbi at aliquam.`,
            `Netus nisi volutpat donec condimentum nunc
             eu sem odio condimentum hendrerit nisl mollis scelerisque ad vitae a eu.`,
             `Etiam dictumst congue a non class risus sed a. Diam adipiscing a condimentum in a nisl a maecenas libero 
             pharetra tincidunt phasellus justo molestie bibendum. Vestibulum penatibus vestibulum lobortis vehicula 
             euismod a platea taciti a eget in nec cum eget curabitur justo id enim mi velit at cum. Eu amet ut elit 
             a sociis himenaeos eros nunc at pharetra magna suscipit.`],
            shippingObj:{
                firstcondname: `MAECENAS IACULIS`,
                firstcondinfo:`Vestibulum curae torquent diam diam commodo parturient penatibus nunc dui adipiscing 
                convallis bulum parturient suspendisse parturient a.Parturient in parturient scelerisque nibh lectus 
                quam a natoque adipiscing a vestibulum hendrerit et pharetra fames nunc natoque dui.`,
                secondcondname:`ADIPISCING CONVALLIS BULUM`,
                secondcondinfo:`Scelerisque adipiscing bibendum sem vestibulum et in a a a purus lectus faucibus lobortis tincidunt purus 
                lectus nisl class eros.Condimentum a et ullamcorper dictumst mus et tristique elementum nam inceptos hac parturient 
                scelerisque vestibulum amet elit ut volutpat.`,
                imgf: `assets/images/wood-ship-1.jpg.webp`,
                imgs:`assets/images/wood-ship-3.jpg.webp`
            }
        }
    },
    methods:{
        addReview(productReview){
            this.reviews.push(productReview);
        }
    },
})

Vue.component('product-reviews',{
    template:`
    <div class="container">
        <div class="leave-review-tab">
            <div class="review-tab-title">Leave a Review!</div>
            <form action="#" class="review-form" @submit.prevemt="onSubmit">
                <div class="input-box">
                    <p class="input-title">Name:</p>
                    <input v-model="name" type="text" placeholder="Enter your name" required>
                </div>
                <div class="input-box">
                    <p class="input-title">Email:</p>
                    <input v-model="email" type="text" placeholder="Enter your email" required>
                </div>
                <div class="input-box">
                    <p class="input-title">Leave your Review:</p>
                    <textarea v-model="review" name="review"></textarea>
                </div>
                <div>
                    <input type="submit" value="Submit"/>
                </div>
            </form>
        </div>
    </div>
    `,
    data(){
        return{
            name:null,
            email:null,
            review:null,
        }
    },
    methods:{
        onSubmit(){
            let productReview = {
                name: this.name,
                email: this.email,
                review: this.review
            }
            this.$emit('review-submitted',productReview)
            this.name = null;
            this.review = null;
            this.email = null;
            console.log(productReview)
        }
    }
})
var productApp = new Vue({
    el: '#productApp',
    data:{
        cartCount: [],
    },
    methods:{
        updateCart(id){
            this.cartCount.push(id);
        },
        decrementCart(id){
            console.log(id)
            this.cartCount.pop(id);
            console.log(this.cartCount)
        }
    }
})