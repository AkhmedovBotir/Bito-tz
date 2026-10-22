import { useEffect, useState } from 'react'
import { apiGet } from '@/shared/api/client'

export type Product = {
  _id: string
  name: string
  salePrice: number
  costPrice: number
  unitsPerBlock: number
}

export type Warehouse = {
  _id: string
  name: string
  subWarehouses: { _id: string; name: string }[]
}

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      apiGet<Product[]>('/api/products'),
      apiGet<Warehouse[]>('/api/warehouses'),
    ])
      .then(([p, w]) => {
        setProducts(p)
        setWarehouses(w)
      })
      .catch((e) => setError(e.message))
  }, [])

  return { products, warehouses, error }
}
