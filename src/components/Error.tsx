function Error({ show = false, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return <p className="text-white bg-red-400 p-2 rounded my-2">{message}</p>;
}

export default Error;
