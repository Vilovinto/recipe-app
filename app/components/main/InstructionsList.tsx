interface InstructionsListProps {
  instructions: string[];
  onInstructionChange: (index: number, value: string) => void;
  onAddInstruction: () => void;
  onRemoveInstruction: (index: number) => void;
}

export default function InstructionsList({
  instructions,
  onInstructionChange,
  onAddInstruction,
  onRemoveInstruction,
}: InstructionsListProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
      <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
        Instructions
      </h3>

      <div className="space-y-4">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-start space-x-4">
            <span className="shrink-0 w-8 h-8 bg-[#FFE478] text-[#0D0702] rounded-full flex items-center justify-center text-sm font-semibold font-['Fira_Sans']">
              {index + 1}
            </span>
            <textarea
              value={instruction}
              onChange={e => onInstructionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
              rows={3}
              placeholder={`Step ${index + 1}...`}
            />
            {instructions.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveInstruction(index)}
                className="text-red-600 hover:text-red-700 font-['Fira_Sans']"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={onAddInstruction}
          className="w-full py-2 border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg text-white hover:text-white/80 hover:border-[rgba(230,221,214,0.8)] font-['Fira_Sans']"
        >
          + Add Step
        </button>
      </div>
    </div>
  );
}
