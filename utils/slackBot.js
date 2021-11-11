import axios from 'axios'

const sendToServerEvents = ({ name, text }) =>
  new Promise(async (resolve, reject) => {
    let blocks = []

    const date = new Date()
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Nuovo evento ${name} del ${date.getDate()}/${date.getMonth() +
          1}/${date.getFullYear()}*`
      }
    })
    blocks.push({ type: 'divider' })
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text } })

    try {
      await axios.post(
        'https://hooks.slack.com/services/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',
        { text: 'Server Notification', blocks }
      )

      resolve()
    } catch (err) {
      console.error(err)

      reject(err)
    }
  })

export { sendToServerEvents }
