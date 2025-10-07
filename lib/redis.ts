import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6479')

redis.on('connect', () => console.log('✅ Connected to Redis'))
redis.on('error', (err) => console.error('❌ Redis Error', err))

export default redis
