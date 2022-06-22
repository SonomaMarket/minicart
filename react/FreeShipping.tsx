import React, { useEffect, useState } from 'react';
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import styles from './styles.css'

const FreeShipping = () => {
  const { orderForm: { items } } = useOrderForm()
  const [totalPrice, setTotalPrice] = useState(0)
  const [percent, setPercent] = useState(0)
  const freeShippingPrice = 350;

  useEffect(() => {
    const total = items.reduce((acc:number, item:{priceDefinition: {total:number}}) => acc + (item.priceDefinition.total) / 100, 0)
    setTotalPrice(total)
    setPercent((total * 100) / freeShippingPrice)
  }, [items])
  

  if(!items.length) return null

  if(totalPrice > freeShippingPrice) return (
    <div className={styles.freeShipping}>
      <div className={styles.freeShippingText}>
        Você ganhou <strong className={styles.freeShippingHighlight}>frete grátis!</strong>
      </div>
      <input 
        type="range"
        min="0" 
        max={freeShippingPrice} 
        value={totalPrice} 
        className={styles.freeShippingRange} 
        style={{background: '#A72543'}} 
        disabled 
      />
    </div>
  )

  return (
    <div className={styles.freeShipping}>
      <div className={styles.freeShippingText}>
        Faltam 
        <strong className={styles.freeShippingHighlight}>R${(freeShippingPrice - totalPrice).toFixed(2).replace(".",",")}</strong> 
        para você ganhar 
        <strong className={styles.freeShippingHighlight}>frete grátis!</strong>
      </div>
      <input 
        type="range"
        min="0" 
        max={freeShippingPrice} 
        value={totalPrice} 
        className={styles.freeShippingRange} 
        style={{background: 'linear-gradient(to right, #A72543 0%, #A72543 ' + percent + '%, #fff ' + percent + '%, white 100%)'}} 
        disabled 
       />
    </div>
  )
}

export default FreeShipping
