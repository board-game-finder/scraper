const fetch = require('isomorphic-fetch')
const async = require('async')

const from = +process.argv[2]
const to = +process.argv[3]

process.stderr.write(`from ${from} to ${to}\n`)

function getBoardGame(index) {
  const url = `https://www.boardgamegeek.com/xmlapi/boardgame/${index}`
  return fetch(url)
    .then(data => {
      if(data.status !== 200) {
        process.stderr.write('STATUS CODE: ' + data.status + '\n')
        process.exit(1)
      }
      return data.text()
    })
    .then(text => {
      console.log('%DELIMETER_SEQUENCE%')
      console.log(text)
    })
    .catch(err => {
      process.stderr.write('NOPE', err)
    })
}

const treshHoldTime = 510

async.timesLimit(to - from, 1, function(n, next){
  n += from
  const timeA = Date.now()
  getBoardGame(n).then(() => {
    process.stderr.write(n  + ' is done!\n')
    timeB = Date.now()
    if(timeB - timeA >= treshHoldTime) {
      next()
    } else {
      setTimeout(next, treshHoldTime - (timeB - timeA))
    }
  })
}, (err) => {
  if(err) {
    process.stderr.write('NOPE', err)
  }
})
