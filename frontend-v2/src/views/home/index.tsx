import ListeLiens from "../../components/ui/liste-liens";
import { getLiens } from "../../utils/liens";

const liens = getLiens();

const HomePage = () => {
  return (
    <div className="w-full flex-1 flex justify-center">
      <div className="w-4/6 text-content mt-32">
        <h1 className="text-5xl font-bold text-primary">Alerte Arrosoir</h1>
        <div className="p-8">
          <ListeLiens listeLiens={liens} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
