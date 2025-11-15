import { useEffect, useMemo } from 'react'
import { getCardsForSession } from '../../services/card-service'
import { useState } from 'react'
import { ColumnType, type Card } from '../../types'
import CardComponent from '../Card/Card'
import  Column from '../Column/Column'

export default function Session() {
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<Card[]>([])
  const [error, setError] = useState<string | null>(null)

  const wentWellCards = useMemo(
    () => cards.filter((card) => card.columnType === ColumnType.WENT_WELL),
    [cards]
  )
  const improveCards = useMemo(
    () => cards.filter((card) => card.columnType === ColumnType.IMPROVE),
    [cards]
  )
  const actionsCards = useMemo(
    () => cards.filter((card) => card.columnType === ColumnType.ACTIONS),
    [cards]
  )

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

  function handleCardAdded(newCard: Card) {
    setCards((prevCards) => [...prevCards, newCard])
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return (
    <div className='app-container' data-container data-stack="gap:md">
      <header>
        <h1>hello, alex</h1>
        <p>Welcome to Retro Session ID: 1</p>
      </header>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div data-switcher="gap:sm collapse:sm">
        <Column title={ColumnType.WENT_WELL} onCardAdded={handleCardAdded}>
          {!loading && wentWellCards.length > 0 && wentWellCards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
        <Column title={ColumnType.IMPROVE} onCardAdded={handleCardAdded}>
          {!loading && improveCards.length > 0 && improveCards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
        <Column title={ColumnType.ACTIONS} onCardAdded={handleCardAdded}>
          {!loading && actionsCards.length > 0 && actionsCards.map((card) => (
            <CardComponent key={card.id} {...card} />
          ))}
        </Column>
      </div>
    </div>
  )
}
