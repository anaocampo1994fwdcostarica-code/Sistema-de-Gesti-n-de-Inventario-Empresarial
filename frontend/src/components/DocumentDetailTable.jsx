import DataTable from './DataTable'

export default function DocumentDetailTable({ details, editable, onEdit, onDelete, unitLabel, unitField }) {
  const columns = [
    { key: 'producto', label: 'Producto', render: (row) => row.producto?.nombre || `#${row.productoId}` },
    { key: 'ubicacion', label: 'Ubicación', render: (row) => row.ubicacion?.nombre || `#${row.ubicacionId}` },
    { key: 'cantidad', label: 'Cantidad' },
    { key: unitField, label: unitLabel, render: (row) => `₡${Number(row[unitField]).toLocaleString('es-CR', { minimumFractionDigits: 2 })}` },
    { key: 'subtotal', label: 'Subtotal', render: (row) => `₡${Number(row.subtotal).toLocaleString('es-CR', { minimumFractionDigits: 2 })}` },
  ]
  if (editable) columns.push({ key: 'acciones', label: 'Acciones', render: (row) => <div className="cell-actions"><button className="table-action" onClick={() => onEdit(row)}>Editar</button><button className="table-action table-action--danger" onClick={() => onDelete(row)}>Eliminar</button></div> })
  return <DataTable columns={columns} rows={details} emptyTitle="Sin detalles" emptyDescription="Agrega al menos un producto antes de confirmar." />
}
