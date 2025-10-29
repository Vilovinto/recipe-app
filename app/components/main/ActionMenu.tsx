import { Recipe } from '../../types';
import { useRef, useEffect, useState } from 'react';

interface ActionMenuProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export default function ActionMenu({
  recipe,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const handleActionMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionMenu(!showActionMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(recipe);
    setShowActionMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(recipe);
    setShowActionMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-10" ref={actionMenuRef}>
      <button
        onClick={handleActionMenuToggle}
        aria-pressed={showActionMenu}
        className={`group w-8 h-8 border-[1.5px] rounded-lg flex items-center justify-center transition-colors duration-200 ease-out ${
          showActionMenu
            ? 'bg-[#FFE478]/15 border-[#FFE478]'
            : 'border-[rgba(182,160,145,0.2)]'
        }`}
      >
        <svg
          width="18"
          height="4"
          viewBox="0 0 18 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-colors duration-200 ease-out"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0ZM7 2C7 0.89543 7.89543 0 9 0C10.1046 0 11 0.89543 11 2C11 3.10457 10.1046 4 9 4C7.89543 4 7 3.10457 7 2ZM14 2C14 0.89543 14.8954 0 16 0C17.1046 0 18 0.89543 18 2C18 3.10457 17.1046 4 16 4C14.8954 4 14 3.10457 14 2Z"
            fill={showActionMenu ? '#FFE478' : '#E6D8D6'}
          />
        </svg>
      </button>

      {showActionMenu && (
        <div className="absolute left-0 top-full mt-1 w-[102px] h-[64px] bg-[#FFE478] rounded-[8px] z-9999 flex flex-col items-stretch p-1 gap-2">
          <button
            onClick={handleEdit}
            className="flex flex-row justify-start items-center px-1 py-0.5 gap-2.5 w-full h-6 rounded-[4px] transition-colors bg-transparent hover:bg-[rgba(255,255,255,0.3)]"
          >
            <span className="w-[86px] h-5 font-['Fira_Sans'] font-normal text-[16px] leading-[20px] text-[#2D2726] text-left">
              Edit
            </span>
          </button>
          <button
            onClick={handleDelete}
            className="flex flex-row justify-start items-center px-1 py-0.5 gap-2.5 w-full h-6 rounded-[4px] transition-colors bg-transparent hover:bg-[rgba(255,255,255,0.3)]"
          >
            <span className="w-[86px] h-5 font-['Fira_Sans'] font-normal text-[16px] leading-[20px] text-[#2D2726] text-left">
              Delete
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
