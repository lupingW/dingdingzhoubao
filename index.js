const axios = require('axios')
const crypto = require('crypto');
const { atUserMap, zhoubao, mini } = require('./config.json');

const getSign = (secret, timestamp) => {
  const content = `${timestamp}\n${secret}`
  const str = crypto.createHmac('sha256', secret).update(content).digest().toString('base64');
  return encodeURIComponent(str);
}

const sendMessage = (config, data) => {
  const timestamp = Date.now()
  const sign = getSign(config.secret, timestamp)
  const url = `${config.webhook}&timestamp=${timestamp}&sign=${sign}`
  console.log('执行发送钉钉push')
  axios({
    url,
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    data
  }).then(res => console.log(res))
}


const sendWeeklyReportReminder = () => {
  const day = new Date(Date.now()).getDay()
  console.log('今天是周' + day, new Date())
  if (day === 4) {
    console.log('今天周四')
    sendMessage(zhoubao, {
      'at': {
        'isAtAll': true
      },
      'text': {
          'content': '请大家在周会前填写完周报'
      },
      'msgtype':'text'
    })
  }
}

sendWeeklyReportReminder()
