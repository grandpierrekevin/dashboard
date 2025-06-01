import { render } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
describe('Select', () => {
  it('doit rendre le composant Select', () => {
    render(
      <Select>
        <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Un</SelectItem>
        </SelectContent>
      </Select>
    );
  });
}); 