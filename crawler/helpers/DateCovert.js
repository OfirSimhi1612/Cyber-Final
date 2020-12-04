const SEC = 1000
const MIN = SEC * 60
const HOUR = MIN * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30 // not accurate
const YEAR = DAY * 365

function dateParser(date){
    // console.log(date)
    // console.log(new Date(date.toLowerCase().replace('rd', '').replace('th', '')))
    const d = new Date(date.toLowerCase().replace('rd', '').replace('th', '').replace('edited', ''))
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
          return wordsToDate(date.replace(/\u00a0/g, " ").toLowerCase())
        } else {
          return d.getTime()
        }
      } else {
        // not a date
      }
}

function wordsToDate(date){
    const unit = date.split(' ')
    switch (unit[1]){
        case 'years':
            return Date.now() - unit[0] * YEAR
        case 'year':
            return Date.now() - unit[0] * YEAR
        case 'months':
            return Date.now() - unit[0] * MONTH
        case 'month':
            return Date.now() - unit[0] * MONTH
        case 'weeks':
            return Date.now() - unit[0] * WEEK
        case 'week':
            return Date.now() - unit[0] * WEEK
        case 'days':
            return Date.now() - unit[0] * DAY
        case 'day':
            return Date.now() - unit[0] * DAY
        case 'hours':
            return Date.now() - unit[0] * HOUR
        case 'hour':
            return Date.now() - unit[0] * HOUR
        case 'minutes':
            return Date.now() - unit[0] * MIN
        case 'minute':
            return Date.now() - unit[0] * MIN
        case 'seconds':
            return Date.now() - unit[0] * SEC
        case 'second':
            return Date.now() - unit[0] * SEC
    }
}


module.exports = dateParser