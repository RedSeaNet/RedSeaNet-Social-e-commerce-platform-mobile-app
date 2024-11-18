// async function test() {
//   for (var i = 1; i < 5; i++) {
//     setTimeout(function timer() {
//       console.log(i);
//     }, i * 1000);
//     await sleep();
//   }
// }
// function sleep() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// }
//
// test()

for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
