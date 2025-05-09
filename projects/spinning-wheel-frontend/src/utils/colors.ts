const PASTEL_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', 
  '#D7BAFF', '#FFC4FF', '#C7FFD8', '#FFE5B4', '#F8C8DC'
];

export const getColorByIndex = (index: number) =>
  PASTEL_COLORS[index % PASTEL_COLORS.length];