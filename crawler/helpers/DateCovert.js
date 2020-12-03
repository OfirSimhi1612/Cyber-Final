const SEC = 1000
const MIN = SEC * 60
const HOUR = MIN * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30 // not accurate
const YEAR = DAY * 365

function dateParser(date){
    const d = new Date(date)
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
          return wordsToDate(date)
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
        case 'Years':
            return Date.now() - unit[0] * YEAR
        case 'Year':
            return Date.now() - unit[0] * YEAR
        case 'Months':
            return Date.now() - unit[0] * MONTH
        case 'Month':
            return Date.now() - unit[0] * MONTH
        case 'Weeks':
            return Date.now() - unit[0] * WEEK
        case 'Week':
            return Date.now() - unit[0] * WEEK
        case 'Days':
            return Date.now() - unit[0] * DAY
        case 'Day':
            return Date.now() - unit[0] * DAY
        case 'Hours':
            return Date.now() - unit[0] * HOUR
        case 'Hour':
            return Date.now() - unit[0] * HOUR
        case 'Minutes':
            return Date.now() - unit[0] * MIN
        case 'Minute':
            return Date.now() - unit[0] * MIN
        case 'Seconds':
            return Date.now() - unit[0] * SEC
        case 'Second':
            return Date.now() - unit[0] * SEC
    }
}


module.exports = dateParser