import { TopBar, NotesList } from '../components';

function Home() {
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <TopBar />
      <div className="flex-1 p-6 overflow-y-auto">
        <NotesList />
      </div>
    </div>
  );
}

export default Home;
