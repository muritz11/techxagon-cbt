import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function SearchableSelect({
  value,
  options,
  placeholder = "Select option...",
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((val) => val.value === value);
  //   const [selected, setSelected] = useState<Option | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (opt: Option) => {
    // setSelected(opt);
    setOpen(false);
    setQuery("");
    onChange && onChange(opt.value);
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger Box */}
      <div
        className="border border-gray-300 outline-none rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "" : "text-gray-400"}>
          {value ? selected?.label : placeholder}
        </span>
        <span className="text-gray-500">▾</span>
      </div>

      {open && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-20">
          {/* Search Box */}
          <input
            type="text"
            className="w-full px-3 py-2 border-b outline-none"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(opt)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
