let count = 255
let element = ''
for (let i = 1; i < 256; i++) {
  element += `<div class="item ${i % 2 === 0 ? 'item-even' : 'item-odd'}"></div>`
}
document.getElementById('cell-box').innerHTML = element
