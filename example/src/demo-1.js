import './style/index.css';
import $ from '../../src/index';

const $root = $('#app');
window.$ = $;
$root.on('click', 'li', function () {
  console.log(this, 'delegated!');
})

console.log($root);
