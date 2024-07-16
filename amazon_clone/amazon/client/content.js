const search_data = localStorage.getItem('search-item');
console.log(search_data);

document.addEventListener('DOMContentLoaded',function(){
    const accountsLink = document.getElementById('accounts-link');
    const dialogueBox = document.getElementById('dialogue-box');

    // Show the dialogue box when hovering over the "Accounts" link
    accountsLink.addEventListener('mouseover', function() {
      dialogueBox.style.display = 'block';
    });

    // Hide the dialogue box when the mouse leaves the "Accounts" link or the dialogue box itself
    accountsLink.addEventListener('mouseleave', function() {
      dialogueBox.style.display = 'none';
    });

    dialogueBox.addEventListener('mouseleave', function() {
      dialogueBox.style.display = 'none';
    });
    const search=document.querySelector('.product-input');
    search.value=search_data;
    function simulateclick()
    {
        const button = document.getElementById('search');
        button.click();
    }
    simulateclick();
    
})




document.getElementById('search').addEventListener("click",function(){
    // filter1
    const {min,max}=getCheckedValue()
    console.log('min= '+min+' max= '+max)

    //filter2
    const {sortby}=sortBy()
    console.log(sortby)

    //filter3
    const {cust_reviews}=reviews()
    console.log(cust_reviews)

    //filter4
    const {color}=colors()
    console.log(color)

    const productInput=document.querySelector('.product-input').value;
    const category=document.querySelector('#category').value;
    let product=''
    function updateProduct()
    {
        if(productInput.trim()!=='')
        {
            product=productInput;
            if(min!=-1||max!=-1)
            {
                url=`/api/filters?title=${product}&min=${min}&max=${max}&color=${color}&reviews=${cust_reviews}&sortby=${sortby}`
                fetch(url)
                .then(response=>response.json())
                .then(data=>loadHtmldata(data))
            }
            else{
                fetch('http://localhost:5000/api/getproduct/'+product)
                .then(response=>response.json())
                .then(data=>loadHtmldata(data));
            }
        }
        else
        {
            product=category;
            console.log(product);
            fetch('http://localhost:5000/api/getcategory/'+product)
            .then(response=>response.json())
            .then(data=>loadHtmldata(data))
        }
    }
    updateProduct();
})


function loadHtmldata(data){
    productContent=document.querySelector('.content');
    productContent.innerHTML='';
    console.log(data.length)
    if(data.length==0)
    {
        productContent.innerHTML='NO PRODUCTS FOUND'
        productContent.style.display='flex'
        productContent.style.justifyContent='center'
        productContent.style.margin='240px'
        productContent.style.fontSize='40px'
    }
    for(let i=0;i<data.length;i++)
    {
        let productImage=data[i].imgUrl;
        let productTitle=data[i].title;
        let productRating=data[i].stars;
        let productSales=data[i].boughtInLastMonth;
        let productPrice=data[i].price;
        // let productDelivery=productData[i].delivery;
        let productUrl=data[i].productURL;
        console.log(productTitle)
        console.log(productRating)
        console.log(productSales)
        console.log(productPrice)
        console.log(productImage)

        if(productSales<=0){
            productSales=Math.floor(Math.random() * 10)+'K+ bought in past month';
        }
        else{
            productSales=productSales+'K+ bought in past month';
        }

        productContent.innerHTML+=`<div class='container'>
                                        <div class="img-data">
                                            <div class="picture">
                                                <img src="${productImage}" class="productimg">
                                            </div>
                                        </div>
                                        <div class="descript">
                                            <div class="title">
                                                <span><a href='${productUrl}' class='entire-product'>${productTitle}</a></span>
                                            </div>
                                            <div class="rating${i}"></div>
                                            <div class="sales"><span>${productSales}</span></div>
                                            <div class="price"><span style="font-size: 28px;">$${productPrice}</span></div>
                                        </div>
                                    </div>`
        const rating=document.querySelector(`.rating${i}`)
        let full_star=Math.floor(productRating)
        let half_star=productRating-full_star
        let j=0;
        while(j<full_star)
        {
            rating.innerHTML+=`<i class="fa-solid fa-star" style="color:orange;"></i>`
            j+=1;
        }
        if(half_star>0 && half_star!=0)
        {
            rating.innerHTML+=`<i class="fa-solid fa-star-half-stroke" style="color:orange;"></i>`
        }
        rating.innerHTML+=`<span>${productRating}</span>`   
                                            
    }
}

function getCheckedValue() {
    const checkedRadioButton = document.querySelector('input[type="radio"][name="price"]:checked');
    let min,max,checkedValue;
    try{
        checkedValue = checkedRadioButton.value;
        console.log(checkedValue)

    }
    catch{
        checkedValue=null;
        console.log(checkedValue)
    }
    switch(checkedValue){
        case 'low':
            min=0;
            max=25;
            break;
        case 'medium':
            min=25;
            max=100;
            break;
        case 'high':
            min=100;
            max=200;
            break
        case 'very_high':
            min=200;
            max=null;
            break;
        default:
            min=-1;
            max=-1;
    }  
    return {
        min:min,
        max:max
    }
}

function sortBy(){
    const sortby_btn = document.querySelector('input[type="radio"][name="sort-by"]:checked');
    let sortby_value;
    try{
        sortby_value=sortby_btn.value
        console.log(sortby_value)
    }
    catch{
        sortby_value='ASC';
        console.log(sortby_value)
    }
    return {
        sortby:sortby_value
    }
}

function reviews(){
    const review_btn = document.querySelector('input[type="radio"][name="reviews"]:checked');
    let getReviews;
    try{
        getReviews=review_btn.value;
        console.log(getReviews)
        switch(getReviews)
        {
            case '5star':
                getReviews=5;
                break;
            case '4star':
                getReviews=4;
                break;
            case '3star':
                getReviews=3;
                break;
            case '2star':
                getReviews=2;
                break;
            case '1star':
                getReviews=1;
                break;
        }
    }
    catch
    {
        getReviews=0
        console.log(getReviews);
    }
    return {
        cust_reviews:getReviews
    }

}

function colors()
{
    const color = document.querySelector('input[type="radio"][name="color"]:checked');
    let color_val;
    try{
        color_val=color.value;
    }
    catch{
        color_val=null;
    }
    return {
        color:color_val
    }
}