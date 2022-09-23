import { Root, Item } from '@radix-ui/react-toggle-group';

interface ToggleGroupProps {
  items: { left?: JSX.Element; text: string }[];
}

export const ToggleGroup = ({ items }: ToggleGroupProps) => {
  return (
    <Root type="single">
      {items.map((i, idx) => (
        <Item key={idx} value={i.text}>
          <div className="px-4 py-1 text-lg tracking-wider border border-purple-600 rounded-lg bg-purple-50">
            {i.text}
          </div>
        </Item>
      ))}
    </Root>
  );
};
