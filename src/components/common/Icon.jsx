function Icon({ name, className }) {
  return (
    <svg className={className}>
      <use xlinkHref={`/icons/group.svg#icon-${name}`}></use>
    </svg>
  );
}

export default Icon;
