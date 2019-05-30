export default interface Transaction {
  timestamp: string
  translation_id: string
  source_language: string
  target_language: string
  client_name: string
  event_name: string
  nr_words: number
  duration: number
}
