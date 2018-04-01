import '__prefix__'

export * as helpers from './helpers'

import * as helpers from './helpers'

if (
  helpers.isMobile() &&
  (process.env.TEST || process.env.NODE_ENV === 'development')
) {
  helpers.CDN.js('//cdn.jsdelivr.net/npm/eruda', 'eruda').then(eruda =>
    eruda.init()
  )
}
