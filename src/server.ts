import mongoose from 'mongoose'
import config from './app/config'
import app from './app'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    app.listen(config.port, () => {
      console.log(`PH university's server is running on port ${config.port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

main()
