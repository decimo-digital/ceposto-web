import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { assetsCodeOptions, purchaseInvoiceFees, purchaseStatuses } from "utils/enums"


import Icon, { icons } from 'components/Icon'
import Button from "./Button"
import Card from "./Card"
import currencyFormatter from "utils/currencyFormatter"

const Accordion = ({ purchase, contract, itemCodes, cancelPurchase, showInvoice }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cancelText, setCancelText] = useState('Annulla acquisto')
  const [purchaseStatus, setPurchaseStatus] = useState(purchase.status)
  const details = JSON.parse(purchase.detail)
  const mappedDetails = new Map()

  for (let [asset, detail] of Object.entries(details)) {
    if (mappedDetails.has(asset))
      mappedDetails.set(asset, mappedDetails.get(asset) + detail.reduce(
        (prev, curr) => prev + curr.amount, 0
      ))
    else
      mappedDetails.set(asset, detail.reduce(
        (prev, curr) => prev + curr.amount, 0
      ))
  }
  const ddt = Array.from(mappedDetails)
  let totalEsentiIva = 0
  let servicesCosts = 0
  let totalAssetToShow = 0

  ddt.map(
    dt => {
      const [asset, amount] = dt
      let partialAssetTotal = 0
      let partialTotal = 0
      details[asset].forEach(detail => {
        partialAssetTotal += Number(detail.amount * detail.value)
      })

      if (asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET) {
        partialTotal = partialAssetTotal +
          (((contract.service_costs[asset] * partialAssetTotal) / 100) -
            ((contract.discounts[asset] * partialAssetTotal) / 100)
            + ((partialAssetTotal * purchaseInvoiceFees.BP_IVA) / 100))
        servicesCosts += ((contract.service_costs[asset] * partialAssetTotal) / 100)
      }
      else {
        partialTotal = partialAssetTotal + ((contract.service_costs[asset] * partialAssetTotal) / 100) -
          ((contract.discounts[asset] * partialAssetTotal) / 100)
        servicesCosts += ((contract.service_costs[asset] * partialAssetTotal) / 100)
        totalEsentiIva += partialTotal
      }
      totalAssetToShow += partialTotal
    }
  )

  if (totalEsentiIva > purchaseInvoiceFees.NOTIVA_THRESHOLD)
    totalAssetToShow += purchaseInvoiceFees.FEE_NOTIVA
  totalAssetToShow += (servicesCosts * 22) / 100


  return (
    <>
      <div className="w-full">
        <>
          <Card className={`${isOpen ? 'border-t border-r border-l rounded-t rounded-b-none' : ' mb-4'}`}>
            <div className='grid grid-cols-4'>
              <div className='my-auto'>
                <label className="flex p-4 leading-normal cursor-pointer" onClick={() => { setIsOpen(!isOpen) }}>
                  <div className='flex font-bold'>{currencyFormatter(totalAssetToShow)} €</div>
                  <div className='px-1'> dettaglio </div>
                  <div className=''>
                    {
                      isOpen
                        ? <Icon name={icons.CHEVRON_UP} />
                        : <Icon name={icons.CHEVRON_DOWN} />
                    }
                  </div>
                </label>

              </div>
              <div className='my-auto'>
                <label className="flex p-4 leading-normal cursor-pointer" onClick={() => { setIsOpen(!isOpen) }}>
                  {dayjs(purchase.datetime).format('DD/MM/YY')}
                </label>

              </div>

              <div className='my-auto'>
                <label className="flex p-4 leading-normal">
                  {purchaseStatus === purchaseStatuses.CANCELED
                    ? <span className='w-full rounded-3xl text-center bg-red-600 bg-opacity-50 p-2 mr-5'>
                      Acquisto annullato
                    </span>
                    : ''
                  }
                  {
                    purchaseStatus === purchaseStatuses.PENDING
                      ? <span className='w-full rounded-3xl text-center bg-yellow-800 bg-opacity-50 p-2 mr-5'>
                        Processamento in corso
                      </span>
                      : ''
                  }

                </label>
              </div>
              <div className='flex items-center'>
                <label className="p-4 text-left">
                  {
                    purchaseStatus === purchaseStatuses.PROCESSED
                      ? <Button
                        className='space-x-2'
                        onClick={async () => await showInvoice(purchase.id)}>
                        <span>
                          <Icon
                            name={icons.DOWNLOAD} />
                        </span>
                        <span>
                          Scarica fattura {purchase.invoice_number}</span>
                      </Button>

                      : purchaseStatus === purchaseStatuses.PENDING
                        ? <Button
                          variant='destructive'
                          onClick={async () => {
                            setCancelText('Annullamento in corso..')
                            await cancelPurchase(purchase)
                            setPurchaseStatus(purchaseStatuses.CANCELED)
                          }}>{cancelText}
                        </Button>
                        : ''
                  }



                </label>
              </div>
            </div>
          </Card>
          {
            isOpen
              ? <Card className='border-b border-r border-l rounded-t-none rounded-b-md mb-4'>
                {
                  ddt.map(
                    dt => {
                      const [asset, amount] = dt
                      const name = itemCodes
                        .filter(
                          item => item.code === asset
                        )[0].name
                      let totalAssetWithFee = 0


                      return <>
                        <div className='grid grid-cols-2'>
                          <div className='p-4'>
                            <p>{name}</p>
                          </div>
                          <div className='p-4 text-right'>
                            {

                              details[asset].map(
                                detail => {
                                  totalAssetWithFee += Number(detail.amount * detail.value)
                                  return (
                                    asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                                      ? <>
                                        <p>{detail.amount} buoni da {currencyFormatter(detail.value)} €</p>
                                        <p>Totale: {currencyFormatter(detail.value * detail.amount)} €</p>
                                        <hr />
                                      </>
                                      : <>
                                        <p>{currencyFormatter(Number(detail.amount * detail.value))}
                                          € di {name}</p>
                                        <hr />
                                      </>

                                  )
                                }
                              )
                            }
                            <p>Sconto: {contract.discounts[asset]} %</p>
                            <p>Costi di servizio: {contract.service_costs[asset]} %</p>
                            {
                              asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                                ? <p>IVA: {purchaseInvoiceFees.BP_IVA}%</p>
                                : ''
                            }

                            <hr />
                            <div><b>TOTALE</b>: {
                              asset === process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                                ? currencyFormatter(totalAssetWithFee +
                                  (((contract.service_costs[asset] * totalAssetWithFee) / 100) -
                                    ((contract.discounts[asset] * totalAssetWithFee) / 100)
                                    + ((totalAssetWithFee * purchaseInvoiceFees.BP_IVA) / 100)))
                                : totalEsentiIva > purchaseInvoiceFees.NOTIVA_THRESHOLD && asset !== process.env.NEXT_PUBLIC_STELLAR_TICKET_BP_ASSET
                                  ? currencyFormatter(totalAssetWithFee + ((contract.service_costs[asset] * totalAssetWithFee) / 100) -
                                    ((contract.discounts[asset] * totalAssetWithFee) / 100))
                                  : currencyFormatter(totalAssetWithFee + ((contract.service_costs[asset] * totalAssetWithFee) / 100) -
                                    ((contract.discounts[asset] * totalAssetWithFee) / 100))
                            } €</div>
                          </div>
                        </div>
                      </>
                    }
                  )
                }

                {
                  totalEsentiIva > purchaseInvoiceFees.NOTIVA_THRESHOLD
                    ? <p className='p-4 text-right'>Imposta di bollo assolta in modo virtuale: {currencyFormatter(purchaseInvoiceFees.FEE_NOTIVA)} €</p>
                    : ''
                }
              </Card>
              : ''
          }
        </>
      </div>

    </>

  )
}

export default Accordion