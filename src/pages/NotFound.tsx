import NotFoundImg from "../../public/404.png";

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full flex flex-col items-center justify-center">
        <img src={NotFoundImg} alt="not found" style={{
          width: '30%'
        }} />
        <p className="text-xl text-gray-600 mb-4 uppercase">Lost? Let’s get you back on track.</p>
      </div>
    </div>
  );
};

export default NotFound;
