async function fetchEntity(entity, id) {
    
    let url = `/api/${entity}-details/${id}`;
    // or whatever the api url is ...
    
    const response = await fetch(url);
    const message = await response.text();
    // message = JSON.parse(message);
    const messageEvent = new CustomEvent('message-event', {
        detail: { message, entity},
        bubbles: true
    });
    dispatchEvent(messageEvent);    
};

const fetchBtn = document.createElement("template");

fetchBtn.innerHTML = `
    <style>
    </style>    
   <span class="fetch-entity">fetch</span>
`;


class EntityFetch extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this._render();
    }
    
    _render() {
        this.attachShadow({mode:'open'});        
        this.shadowRoot.appendChild(fetchBtn.content.cloneNode(true));        
        this.fetchButton = this.shadowRoot.querySelector('.fetch-entity');
        this.fetchButton.addEventListener('click', e => this.buttonClicked(e));
    }

    buttonClicked(evt) {
        fetchEntity(this.getAttribute("entity"), this.getAttribute("id"));
    }    
            
}

class EntityOutput extends HTMLElement {
    
    constructor() {
        super();
    }
    
    connectedCallback() {
        addEventListener("message-event",e => this.onMessage(e));
    }
    
    onMessage({ detail,entity }) {        
        let d = JSON.parse(detail.message);

        let e = [];
        for (const [key, value] of Object.entries(d)) {
            e.push(`<span>${key}: ${value}</span>`);
        }

        let output = e.map((i) => {
            return `<li>${i}</li>`;
        }).join('');

        this.innerHTML = `<ul>${output}</ul>`;

    }

}

customElements.define("entity-fetch",EntityFetch);
customElements.define('entity-output',EntityOutput);
