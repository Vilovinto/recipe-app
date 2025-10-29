interface RecipeImageUploadProps {
  image: File | null;
  existingImageUrl?: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadId: string;
}

export default function RecipeImageUpload({
  image,
  existingImageUrl,
  onImageSelect,
  uploadId,
}: RecipeImageUploadProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
      <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
        Recipe Image
      </h3>

      {existingImageUrl && !image && (
        <div className="mb-4">
          <img
            src={existingImageUrl}
            alt="Current recipe"
            className="w-full h-48 object-cover rounded-lg"
          />
          <p className="text-sm text-gray-400 mt-2 font-['Fira_Sans']">
            Current image (upload a new one to replace)
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
          id={uploadId}
        />
        <label htmlFor={uploadId} className="cursor-pointer flex flex-col items-center">
          <svg
            className="w-12 h-12 text-[#E6D8D6] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-white font-['Fira_Sans']">
            {image ? image.name : existingImageUrl ? 'Click to upload a new image' : 'Click to upload an image'}
          </p>
        </label>
      </div>
    </div>
  );
}

