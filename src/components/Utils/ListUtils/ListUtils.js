export const DisplayItemList = ({ items, ItemTemplate }) => {
  if (!Array.isArray(items)) return null;

  if (items.length < 1)
    return <p>There are no items that meet your criteria.</p>;

  return items.map((item) => <ItemTemplate key={item.id} {...item} />);
};
