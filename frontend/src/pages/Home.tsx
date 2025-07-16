import TopBar from '../components/TopBar';

function Home() {
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      <TopBar />
      <div className="flex-1 p-6 overflow-y-auto">
        <p>Notes</p>
      </div>
    </div>
  );
}

export default Home;
