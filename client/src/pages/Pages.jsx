// src/Components/Pages.jsx
import { loremIpsum } from 'lorem-ipsum';

const BuildPage = (index) => (
  <>
    <h3>Page {index}</h3>
    <div>
        <p>Hkgdsbgisdkgsbdikgfhbsd</p>
      {/* Page {index} content: { loremIpsum({ count: 5 })} */}
    </div>
  </>
);

export const PageOne = () => BuildPage(1);
export const PageTwo = () => BuildPage(2);