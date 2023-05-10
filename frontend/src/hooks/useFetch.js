import useSWR from 'swr'
import bitsFetch from '../Utils/bitsFetch'

const useFetch = ({ payload, action, method = 'POST' }) => {
  const { data, error } = useSWR(action, (uri) => bitsFetch(payload, uri, null, method))
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useFetch
