import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import SubScript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@mantine/tiptap';

export const getDefaultExtensions = () => [
  StarterKit,
  Underline,
  Link,
  Superscript,
  SubScript,
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
];
