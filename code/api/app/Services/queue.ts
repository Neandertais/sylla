import Queue from 'queue'

export const videoQueue = new Queue({ concurrency: 2, autostart: true })
