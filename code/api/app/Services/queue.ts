import Queue from 'queue'

export const videoQueue = new Queue({ concurrency: 3, autostart: true })
