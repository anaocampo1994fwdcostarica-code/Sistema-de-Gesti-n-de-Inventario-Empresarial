import { EmptyState } from './Feedback'
import Loading from './Loading'

export default function DataTable({ columns, rows, loading, emptyTitle = 'No hay registros', emptyDescription = 'Aún no se han registrado datos.' }) {
  if (loading) return <Loading />
  if (!rows.length) return <EmptyState title={emptyTitle} description={emptyDescription} />
  return (
    <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key} data-label={column.label}>{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}</tr>)}</tbody>
    </table></div>
  )
}
