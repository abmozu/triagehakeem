import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex space-x-2 justify-center items-center dark:invert">
      <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="size-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingSpinner;
