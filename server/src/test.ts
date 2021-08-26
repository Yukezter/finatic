// import redis from 'redis'

// const pub = redis.createClient()

// // Activate "notify-keyspace-events" for expired type events
// pub.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], () => {
//   const sub = redis.createClient()

//   // Subscribe to the "notify-keyspace-events" channel used for expired type events
//   sub.subscribe('__keyevent@0__:expired', () => {
//     sub.on('message', (chan, msg) => {
//       console.log(chan, msg)
//     })
//   })
// })

// pub.set('testing', 'string')
// pub.expire('testing', 10)
