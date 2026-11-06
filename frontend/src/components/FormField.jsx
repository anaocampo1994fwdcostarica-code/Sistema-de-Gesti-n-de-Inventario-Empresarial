export default function FormField({ label, required, as = 'input', options = [], children, ...props }) {
  const Component = as
  const isSearch = props.type === 'search'
  return (
    <label className={`form-field${isSearch ? ' form-field--search' : ''}`}>{label}{required && <span> *</span>}
      {as === 'select' ? (
        <select {...props}>{children || options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      ) : isSearch ? <span className="form-field__search-control"><Component {...props} /></span> : <Component {...props} />}
    </label>
  )
}
