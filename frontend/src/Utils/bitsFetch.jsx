/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

import { ajaxURL, nonce, prefix } from "../Config"

export default async function bitsFetch(data, action, queryParam = null, method = 'POST') {
  const uri = new URL(ajaxURL)
  uri.searchParams.append('action', `${prefix}${action}`)
  uri.searchParams.append('_ajax_nonce', nonce)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const options = {
    method,
    headers: {},
  }

  if (method.toLowerCase() === 'post') {
    options.body = data instanceof FormData ? data : JSON.stringify(data)
  }
  const response = await fetch(uri, options)
    .then(res => res.text())
    .then(res => {
      try {
        return JSON.parse(res)
      } catch (error) {
        const parsedRes = res.match(/{"success":(?:[^{}]*)*}/)
        return parsedRes ? JSON.parse(parsedRes[0]) : { success: false, data: res }
      }
    })

  return response
}
