import { useMemo } from 'react'
import DocumentPage from '../components/DocumentPage'
import { comprasApi, confirmCompra, detallesComprasApi } from '../services/inventoryService'
import { getProveedores } from '../services/proveedorService'
export default function Compras(){const config=useMemo(()=>({type:'compra',title:'Compras',singular:'Compra',api:comprasApi,detailsApi:detallesComprasApi,confirm:confirmCompra,relationApi:{list:getProveedores},relationField:'proveedorId',relationAlias:'proveedor',relationLabel:'Proveedor',parentField:'compraId',unitField:'costoUnitario',unitLabel:'Costo unitario'}),[]);return <DocumentPage config={config}/>} 
