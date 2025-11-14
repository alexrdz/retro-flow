import { useEffect } from 'react'
import { getCardsForSession } from '../../services/card-service'
import { useState } from 'react'
import { ColumnType, type Card } from '../../types'
import CardComponent from '../Card/Card'
import  Column from '../Column/Column'

export default function Session() {
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<Card[]>([])
  const [error, setError] = useState<string | null>(null)

  async function fetchCards() {
    try {
      setLoading(true)
      const data = await getCardsForSession("1")
      setCards(data.cards)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return (
    <div className='app-container' data-container data-stack="gap:md">
      <h1>hello, alex</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div data-switcher="gap:sm collapse:sm">
        <Column title={ColumnType.WENT_WELL}>
          {!loading && cards.length > 0 && cards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
        <Column title={ColumnType.IMPROVE}>
          {!loading && cards.length > 0 && cards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
        <Column title={ColumnType.ACTIONS}>
          {!loading && cards.length > 0 && cards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
      </div>
    </div>
  )
}
