export default function FormField({ label, required, as = 'input', options = [], children, ...props }) {
  const Component = as
  return (
    <label>{label}{required && <span> *</span>}
      {as === 'select' ? (
        <select {...props}>{children || options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      ) : <Component {...props} />}
    </label>
  )
}
