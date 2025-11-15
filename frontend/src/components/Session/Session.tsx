import { useMemo } from 'react'
import { ColumnType, type Card } from '../../types'
import CardComponent from '../Card/Card'
import  Column from '../Column/Column'
import useCardService from '../../hooks/use-card-service'

export default function Session() {
  const { cards, loading, error, addCard, removeCard, updateCard } = useCardService ("1")

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


  async function handleCardAdded(
    newCard: Omit<Card, 'id'>
  ): Promise<Card> {
    const createdCard = await addCard(newCard)
    return createdCard
  }


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
            <CardComponent key={card.id} card={card} removeCard={removeCard} onUpdate={updateCard} />
          ))}
        </Column>
        <Column title={ColumnType.IMPROVE} onCardAdded={handleCardAdded}>
          {!loading && improveCards.length > 0 && improveCards.map((card) => (
            <CardComponent key={card.id} card={card} removeCard={removeCard} onUpdate={updateCard} />
          ))}
        </Column>
        <Column title={ColumnType.ACTIONS} onCardAdded={handleCardAdded}>
          {!loading && actionsCards.length > 0 && actionsCards.map((card) => (
            <CardComponent key={card.id} card={card} removeCard={removeCard} onUpdate={updateCard} />
          ))}
        </Column>
      </div>
    </div>
  )
}
