interface NoteItemProps {
  content: string;
}

const NoteItem: React.FC<NoteItemProps> = ({ content }) => {
  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0">
      <p className="text-gray-800">{content}</p>
    </div>
  );
};

export { NoteItem };
