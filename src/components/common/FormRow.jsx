function FormRow({ error, children, className = "" }) {
  return (
    <div className={className}>
      {children}
      <div className="min-h-[25px]">
        {error && (
          <span className="sm:text-sm text-xs text-red-700">{error}</span>
        )}
      </div>
      {/* {error && (
        <span className="sm:text-sm text-xs text-red-700">{error}</span>
      )} */}
    </div>
  );
}

export default FormRow;
