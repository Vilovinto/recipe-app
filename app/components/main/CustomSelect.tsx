"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  hidePlaceholderOption?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
  buttonClassName,
  hidePlaceholderOption = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) return;

    const id = requestAnimationFrame(() => {
      const rect = container.getBoundingClientRect();
      const menuWidth = menu.offsetWidth;
      const viewportWidth = window.innerWidth;
      const willOverflowRight = rect.left + menuWidth > viewportWidth - 8;
      setAlignRight(willOverflowRight);
    });

    return () => cancelAnimationFrame(id);
  }, [open]);

  const selectedLabel = options.find(o => o.value === value)?.label ?? "";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={
          buttonClassName ||
          "px-4 py-2 bg-[#2D2726] border border-[rgba(182,160,145,0.2)] rounded-lg text-[#E6D8D6] font-semibold text-[15px] leading-5 font-['Fira_Sans'] focus:outline-none focus:border-[#FFE478] flex items-center gap-2"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "" : "text-[rgba(255,255,255,0.6)]"}>
          {value ? selectedLabel : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          ref={menuRef}
          className={`absolute ${alignRight ? 'right-0' : 'left-0'} mt-2 z-50 rounded-md border border-[rgba(182,160,145,0.2)] bg-[#2D2726] shadow-lg w-max min-w-32 max-w-[calc(100vw-2rem)] whitespace-nowrap`}
        >
          {!hidePlaceholderOption && (
            <li
              role="option"
              aria-selected={!value}
              className="px-4 py-2 cursor-pointer text-[#E6D8D6] hover:bg-[rgba(255,255,255,0.06)] whitespace-nowrap"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              All
            </li>
          )}
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className="px-4 py-2 cursor-pointer text-[#E6D8D6] hover:bg-[rgba(255,255,255,0.06)] whitespace-nowrap"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


