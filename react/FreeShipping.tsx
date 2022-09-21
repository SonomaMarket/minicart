import React, { useEffect, useState } from 'react';
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { canUseDOM } from 'vtex.render-runtime'
import styles from './styles.css'

const FreeShipping = () => {
  const { orderForm: { items } } = useOrderForm()
  const [totalPrice, setTotalPrice] = useState(0)
  const [percent, setPercent] = useState(0)
  const freeShippingPrice = canUseDOM ? getFreeShippingAmount() : 0;

  useEffect(() => {
    if(!items.length)
      return;
      
    const total = items.reduce((acc:number, item:{priceDefinition: {total:number}}) => acc + (item.priceDefinition?.total) / 100, 0)
    setTotalPrice(total)
    setPercent((total * 100) / freeShippingPrice)
  }, [items, canUseDOM])


  if (!items.length) return null

  if (!freeShippingPrice)
    return null

  if (totalPrice > freeShippingPrice) return (
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
        style={{ background: '#A72543' }}
        disabled
      />
    </div>
  )

  return (
    <div className={styles.freeShipping}>
      <div className={styles.freeShippingText}>
        Faltam <strong className={styles.freeShippingHighlight}>R${(freeShippingPrice - totalPrice).toFixed(2).replace(".", ",")}</strong> para você ganhar <strong className={styles.freeShippingHighlight}>frete grátis!</strong>
      </div>
      <input
        type="range"
        min="0"
        max={freeShippingPrice}
        value={totalPrice}
        className={styles.freeShippingRange}
        style={{ background: 'linear-gradient(to right, #A72543 0%, #A72543 ' + percent + '%, #fff ' + percent + '%, white 100%)' }}
        disabled
      />
    </div>
  )
}

function getFreeShippingAmount() {
  const getUfAndCity = JSON.parse(window.localStorage.getItem("userAdress") || '{"uf":"N/A","localidade":"N/A"}')
  if (regionShippingTable[getUfAndCity.localidade])
    return regionShippingTable[getUfAndCity.localidade]

  if (regionShippingTable[getUfAndCity.uf])
    return regionShippingTable[getUfAndCity.uf]

  return null;
}

const regionShippingTable: any = {
  'SP': 350,
  'RJ': 350,
  'MG': 350,
  'ES': 350,
  'PR': 350,
  'SC': 350,
  'RS': 350,
  'MT': 550,
  'MS': 550,
  'DF': 550,
  'GO': 550,
  'São Paulo': 300,
  'Salvador': 550,
}
export default FreeShipping
