import { useMemo } from 'react'
import DocumentPage from '../components/DocumentPage'
import { clientesApi, confirmVenta, detallesVentasApi, ventasApi } from '../services/inventoryService'
export default function Ventas(){const config=useMemo(()=>({type:'venta',title:'Ventas',singular:'Venta',api:ventasApi,detailsApi:detallesVentasApi,confirm:confirmVenta,relationApi:clientesApi,relationField:'clienteId',relationAlias:'cliente',relationLabel:'Cliente',parentField:'ventaId',unitField:'precioUnitario',unitLabel:'Precio unitario'}),[]);return <DocumentPage config={config}/>} 
