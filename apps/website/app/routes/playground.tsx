import { rust } from '@codemirror/lang-rust';
import EditorView from '@uiw/react-codemirror';
import { ClientOnly } from 'remix-utils';

const data = `
use std::collections::HashMap;

fn main() {
  println!("hello world!")
}
`.trim();

export default () => {
  return (
    <div className="w-3/4 m-auto overflow-scroll h-96">
      <ClientOnly fallback={'Loading Editor'}>
        {() => (
          <EditorView
            extensions={[rust()]}
            value={data}
            theme="dark"
            className="text-xl"
          />
        )}
      </ClientOnly>
    </div>
  );
};
