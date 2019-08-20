let store = prompt('Please enter a store name:');
let quanity = prompt('Please enter an item quanity:');
let product = prompt('Please enter a product found at store:');

let sentence = `I shopped at ${store} for ${quanity} ${product}`;

document.querySelector('p').innerText =sentence;

console.log(sentence);