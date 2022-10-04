export const Loading = () => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div className="w-6 h-6 bg-blue-400 rounded-full animation-delay-100 animate-bounce"></div>
      <div className="w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
      <div className="w-6 h-6 bg-purple-700 rounded-full animation-delay-150 animate-bounce"></div>
    </div>
  );
};
