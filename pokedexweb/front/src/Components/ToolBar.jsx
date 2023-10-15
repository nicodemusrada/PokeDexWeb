import '../assets/css/toolbar.css';
import { AddButton } from './AddButton';
import { FilterSelect } from './FilterSelect';
import { NameInput } from './NameInput';

export function ToolBar({handleNameSearch, handleFilterChange}) {
  return (
    <div className="toolbar">
      <NameInput onSearch={handleNameSearch}/>

      <FilterSelect onFilter={handleFilterChange}/>

      <AddButton/>
    </div>
  );
} 
