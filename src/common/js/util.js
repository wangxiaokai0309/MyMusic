function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
// export function shuffle(arr) {
//   arr.forEach((el, index, array) => {
//     let j = getRandomInt(0, index)
//     let t = el
//     el = array[j]
//     array[j] = t
//   })
//   return arr
// }
