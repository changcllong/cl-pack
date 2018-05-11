import EXAMPLE from './a';

const app = document.getElementById('app');

app.innerHTML = 'HELLO WORLD!';

app.appendChild(document.createTextNode(EXAMPLE));
