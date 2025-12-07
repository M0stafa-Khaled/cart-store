import Loader from "@/components/ui/loader";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center  bg-white">
      <Loader size={70} />
    </div>
  );
};
export default Loading;
