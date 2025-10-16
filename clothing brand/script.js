    document.getElementById('year').textContent = new Date().getFullYear();

    const chips = document.querySelectorAll('.chip');
    const cards = Array.from(document.querySelectorAll('.card'));
    const search = document.getElementById('search');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalAdd = document.getElementById('modalAdd');
    const modalClose = document.getElementById('modalClose');

    // cart state
    let cart = [];
    const cartCount = document.getElementById('cartCount');
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const drawer = document.getElementById('drawer');

    function renderCart(){
      cartList.innerHTML = '';
      let total = 0;
      cart.forEach((it, idx)=>{
        total += it.price;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <img src="${it.img}" alt="${it.name}" />
          <div class="right">
            <div style="font-weight:700">${it.name}</div>
            <div style="color:var(--muted);font-size:13px">Qty: 1</div>
          </div>
          <div style="font-weight:800">₹${it.price}</div>
        `;
        cartList.appendChild(el);
      });
      cartCount.textContent = cart.length;
      cartTotal.textContent = '₹' + total;
    }

    document.getElementById('cartToggle').addEventListener('click',()=>{
      drawer.classList.toggle('open');
    });

    // Add to cart from cards
    document.querySelectorAll('.card .add').forEach((btn,i)=>{
      btn.addEventListener('click',()=>{
        const card = btn.closest('.card');
        addToCart(card);
      });
    });

    function addToCart(card){
      const name = card.dataset.name;
      const price = Number(card.dataset.price || 0);
      const img = card.querySelector('.imgwrap img').src;
      cart.push({name,price,img});
      renderCart();
      // small feedback
      btnPulse(card);
    }

    function btnPulse(card){
      card.animate([{transform:'scale(1)'},{transform:'scale(.995)'}],{duration:160,iterations:1});
    }

    // Details (open modal)
    document.querySelectorAll('.card .details, .card .imgwrap').forEach(el=>{
      el.addEventListener('click', (e)=>{
        const card = e.currentTarget.closest('.card');
        const src = card.querySelector('.imgwrap img').src;
        modalImg.src = src;
        modalName.textContent = card.dataset.name;
        modalPrice.textContent = '₹' + card.dataset.price;
        modalDesc.textContent = card.querySelector('.tag').textContent + ' — Designer-approved print.';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden','false');

        modalAdd.onclick = ()=>{
          cart.push({name:card.dataset.name,price:Number(card.dataset.price),img:src});
          renderCart();
          modal.classList.remove('open');
        }
      });
    });

    modalClose.addEventListener('click', ()=>{modal.classList.remove('open');});
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.remove('open'); });

    // Filters
    chips.forEach(ch=>{
      ch.addEventListener('click', ()=>{
        const f = ch.dataset.filter;
        cards.forEach(c=>{
          if(f==='all' || c.dataset.type === f){ c.style.display = ''; } else { c.style.display = 'none'; }
        });
      });
    });

    // Search
    search.addEventListener('input', ()=>{
      const q = search.value.trim().toLowerCase();
      cards.forEach(c=>{
        const name = c.dataset.name.toLowerCase();
        const tags = c.querySelector('.tag').textContent.toLowerCase();
        if(q === '' || name.includes(q) || tags.includes(q)) c.style.display = ''; else c.style.display = 'none';
      });
    });

    // Shop all scroll
    document.getElementById('shopAll').addEventListener('click', ()=>{ document.getElementById('products').scrollIntoView({behavior:'smooth'}); });

    // initial render
    renderCart();
