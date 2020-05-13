// Variable Global
const section = (el) => document.querySelector(el);
const sectionAll = (el) => document.querySelectorAll(el);

// Variavel de Quantidade do item do Modal
let modalQt = 1;
let modalKey = 0;
let cart = [];

// Map é parecido com ForEach, porém o map retorna uma cópia da estrutura e o foreach só faz interação
//*** Selecionar o arquivo JSON e trabalhar com os itens desse arquivo
pizzaJson.map( ( item, index ) => {

   // Clona o modelo para apresentar os itens
    let pizzaItem = section('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

/** Preenchimento Modal Ativo */
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        // Selecionar o item Clicado para alimentar a modal do item clicado
            /* Podemos usar o THIS também */
        // this.document.querySelector('.pizzaWindowArea .pizzaInfo h1').innerHTML = item.name;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1; // Resetando a quantidade. Essa variavel foi declarada no inicio do arquivo, por isso esta sem o LET

        modalKey = key;

        section('.pizzaWindowArea .pizzaInfo h1').innerHTML = pizzaJson[key].name;
        section('.pizzaWindowArea .pizzaInfo--desc ').innerHTML = pizzaJson[key].description;
        section('.pizzaWindowArea .pizzaBig img').src = pizzaJson[key].img;
        section('.pizzaWindowArea .pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        section('.pizzaInfo--size.selected').classList.remove('selected');

        sectionAll('.pizzaInfo--size').forEach( (size , sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('.pizzaInfo--size span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        section('.pizzaInfo--qt').innerHTML = modalQt;

        /* Ação para Abrir Modal */
        section('.pizzaWindowArea').style.opacity = 0;
        section('.pizzaWindowArea').style.display = 'flex';
        setTimeout( () => {
            section('.pizzaWindowArea').style.opacity = 1;
        }, 300)
        /* end Ação para Abrir Modal */
    });
/** end Preenchimento Modal Ativo */

    section('main .pizza-area').append(pizzaItem);
});

// Eventos dentro da MODAL
// Função Fechar Modal 
let closeModal = () => {
    section('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {
        section('.pizzaWindowArea').style.display = 'none';
    }, 300);
}
// end Função Fechar Modal 

sectionAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( item => {
   item.addEventListener('click', () => {
       closeModal();
   }) 
});

/* Modal - Botão '-' Quantidade  */
section('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1){
        modalQt--;
        section('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
/* end Modal - Botão '-' Quantidade  */

/* Modal - Botão '+' Quantidade  */
section('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    section('.pizzaInfo--qt').innerHTML = modalQt;
});
/* end Modal - Botão '+' Quantidade  */


/* Modal - Navegação Tamanho Pizza */
sectionAll('.pizzaInfo--size').forEach( (size, sizeIndex) =>{

    size.addEventListener('click', () => {
        section('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        // section('.pizzaInfo--size.selected').classList.add('selected');
    });

});
/* end Modal - Navegação Tamanho Pizza */

/* *** CARRINHO DE COMPRA *** */
section('.pizzaInfo--addButton').addEventListener('click', () => {
    
    let sizePizza = parseInt( section('.pizzaInfo--size.selected').getAttribute('data-key') );

    // Antes de adicionar no carrinho, precisamos verificar SE já tem o item, se tiver e for do mesmo tamanho, junta o pedido, senão separa
    // Pegando o index eo id do produto clicado e o tamanho do produto
    let identifier = `${pizzaJson[modalKey].id}@${sizePizza}`;
    
    // Key retorna 0 se for true, e -1 se for falso
    let key = cart.findIndex( (item) => { return item.identifier == identifier });
    
    
    if(key > -1 ) {
        cart[key].quantidade += modalQt

    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size: sizePizza,
            quantidade: modalQt
        });
    }
    
    updateCart(); // função de ativar barra lateral ao adicionar item no carrinho
    closeModal();

});
/* *** end CARRINHO DE COMPRA *** */


function updateCart(){
    
    if( cart.length > 0 ){
        section('aside').classList.add('show');
        // zerando o cart para depois adicionar com append
        section('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find( (item) => {
                return item.id == cart[i].id
            });

            subtotal = pizzaItem.price * cart[i].quantidade;

            console.log(pizzaItem);

            let cartItem = section('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;

                case 1:
                    pizzaSizeName = 'M';
                    break;
            
                default:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName}) `;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                
                if(cart[i].quantidade > 1 ){
                    cart[i].quantidade--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].quantidade++;
                updateCart();
            });

            // Adicionando os itens que pegamos do JSON na div CART
            section('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto; 

        section('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        section('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        section('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        section('aside').classList.remove('show');
    }
}